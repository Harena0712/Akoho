const { getPool, sql } = require('../config/db');
const Lot = require('./lot.model');
const LotAtody = require('./lotAtody.model');
const { getNbResteOeuf, getNbMaleFemelle } = require('../utils/repartition.utils');

function toDateOnly(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(value, days) {
  const date = toDateOnly(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

const Incubation = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM incubation');
    return result.recordset;
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM incubation WHERE id = @id');
    return result.recordset[0];
  },

  async getByLotAtody(idLotAtody) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLotAtody', sql.Int, idLotAtody)
      .query('SELECT * FROM incubation WHERE idLotAtody = @idLotAtody');
    return result.recordset;
  },

  async create({ idLotAtody, nbAtodyF, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLotAtody', sql.Int, idLotAtody)
      .input('nbAtodyF', sql.Int, nbAtodyF)
      .input('date', sql.Date, date)
      .query('INSERT INTO incubation (idLotAtody, nbAtodyF, date) OUTPUT INSERTED.* VALUES (@idLotAtody, @nbAtodyF, @date)');
    return result.recordset[0];
  },

  async existsForLotAtodyAndDate(idLotAtody, date) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLotAtody', sql.Int, idLotAtody)
      .input('date', sql.Date, date)
      .query('SELECT TOP 1 id FROM incubation WHERE idLotAtody=@idLotAtody AND date=@date');
    return result.recordset.length > 0;
  },

  async existsForLotAtody(idLotAtody) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLotAtody', sql.Int, idLotAtody)
      .query('SELECT TOP 1 id FROM incubation WHERE idLotAtody=@idLotAtody');
    return result.recordset.length > 0;
  },

  async processByDate(date) {
    const pool = await getPool();
    const targetDate = toDateOnly(date);

    const result = await pool.request().query(
      `SELECT
         la.id AS lotAtodyId,
         la.idLot,
         la.nbAtody,
         la.date AS lotAtodyDate,
         l.idRace,
         r.oeufPourri,
         r.male,
         r.femelle,
         r.nbJourIncubation
       FROM lotAtody la
       JOIN lot l ON l.id = la.idLot
       JOIN race r ON r.id = l.idRace`
    );

    const created = [];

    for (const row of result.recordset) {
      const incubationDate = addDays(row.lotAtodyDate, row.nbJourIncubation || 30);
      // Déclencher si aujourd'hui >= date d'incubation prévue
      if (targetDate.getTime() < incubationDate.getTime()) {
        continue;
      }

      const alreadyCreated = await this.existsForLotAtody(row.lotAtodyId);
      if (alreadyCreated) {
        continue;
      }

      const nbAtodyF = getNbResteOeuf({ nbAtody: row.nbAtody }, row);
      if (nbAtodyF <= 0) {
        continue;
      }

      const repartition = getNbMaleFemelle(row, nbAtodyF);

      const incubation = await this.create({
        idLotAtody: row.lotAtodyId,
        nbAtodyF,
        date: incubationDate
      });

      const nouveauLot = await Lot.create({
        idRace: row.idRace,
        nb: nbAtodyF,
        nbMale: repartition.nbMale,
        nbFemelle: repartition.nbFemelle,
        age: 0,
        date: incubationDate,
        PU: 0
      });
      console.log(`Incubation créée pour lotAtodyId ${row.lotAtodyId} avec ${nbAtodyF} atody fécondés, jours d'eclosion a la date ${incubationDate.toISOString().slice(0, 10)}, nouveau lot créé avec id ${nouveauLot.id} à la date ${incubationDate.toISOString().slice(0, 10)}`);

      await LotAtody.setEclos(row.lotAtodyId);

      created.push({ incubation, nouveauLot });
    }

    return created;
  },

  async update(id, { idLotAtody, nbAtodyF, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idLotAtody', sql.Int, idLotAtody)
      .input('nbAtodyF', sql.Int, nbAtodyF)
      .input('date', sql.Date, date)
      .query('UPDATE incubation SET idLotAtody=@idLotAtody, nbAtodyF=@nbAtodyF, date=@date WHERE id=@id; SELECT * FROM incubation WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM incubation WHERE id = @id');
  }
};

module.exports = Incubation;
