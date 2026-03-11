const { getPool, sql } = require('../config/db');

function joursEntre(dateDebut, dateFin) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  return Math.floor((fin - debut) / (1000 * 60 * 60 * 24));
}

function getConfSakafoForWeek(listConfSakafo, semaine) {
  const matching = listConfSakafo
    .filter(c => c.age <= semaine)
    .sort((a, b) => b.age - a.age);
  return matching.length > 0 ? matching[0] : null;
}

function calculPoidsExact(listConfSakafo, ageSemaines) {
  if (ageSemaines < 0) return 0;

  const semainesCompletes = Math.floor(ageSemaines);
  const fraction = ageSemaines - semainesCompletes;

  let total = 0;
  for (let semaine = 0; semaine <= semainesCompletes; semaine++) {
    const conf = getConfSakafoForWeek(listConfSakafo, semaine);
    total += conf ? conf.variationPoid : 0;
  }

  if (fraction > 0) {
    const conf = getConfSakafoForWeek(listConfSakafo, semainesCompletes + 1);
    total += conf ? conf.variationPoid * fraction : 0;
  }

  return Math.round(total * 100) / 100;
}

const ConfSakafo = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM confSakafo');
    return result.recordset;
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM confSakafo WHERE id = @id');
    return result.recordset[0];
  },

  async getByRace(idRace) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idRace', sql.Int, idRace)
      .query('SELECT * FROM confSakafo WHERE idRace = @idRace');
    return result.recordset;
  },

  async getPoidsAkoho(race, dateDebut, dateFin) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idRace', sql.Int, race)
      .query('SELECT * FROM confSakafo WHERE idRace = @idRace ORDER BY age');

    const listConfSakafo = result.recordset;
    const jours = joursEntre(dateDebut, dateFin);
    const ageSemaines = jours / 7;
    const poids = calculPoidsExact(listConfSakafo, ageSemaines);

    return {
      race: Number(race),
      dateDebut,
      dateFin,
      jours,
      ageSemaines: Math.round(ageSemaines * 100) / 100,
      poids
    };
  },

  async create({ age, idRace, variationPoid, sakafoG }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('age', sql.Int, age)
      .input('idRace', sql.Int, idRace)
      .input('variationPoid', sql.Float, variationPoid)
      .input('sakafoG', sql.Float, sakafoG)
      .query('INSERT INTO confSakafo (age, idRace, variationPoid, sakafoG) OUTPUT INSERTED.* VALUES (@age, @idRace, @variationPoid, @sakafoG)');
    return result.recordset[0];
  },

  async update(id, { age, idRace, variationPoid, sakafoG }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('age', sql.Int, age)
      .input('idRace', sql.Int, idRace)
      .input('variationPoid', sql.Float, variationPoid)
      .input('sakafoG', sql.Float, sakafoG)
      .query('UPDATE confSakafo SET age=@age, idRace=@idRace, variationPoid=@variationPoid, sakafoG=@sakafoG WHERE id=@id; SELECT * FROM confSakafo WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM confSakafo WHERE id = @id');
  }
};

module.exports = ConfSakafo;
