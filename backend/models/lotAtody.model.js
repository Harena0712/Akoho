const { getPool, sql } = require('../config/db');

const LotAtody = {
  async getCapaciteByDate(date) {
    const pool = await getPool();
    const result = await pool.request()
      .input('date', sql.Date, date)
      .query(
        `SELECT
           l.id AS idLot,
           r.libelle AS race,
           l.nbFemelle,
           r.capaciteOeufs,
           (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) AS maxOeufs,
           ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0) AS oeufsObtenus,
           CASE
             WHEN (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) - ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0) < 0
               THEN 0
             ELSE (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) - ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0)
           END AS oeufsRestants
         FROM lot l
         JOIN race r ON r.id = l.idRace
         LEFT JOIN lotAtody la ON la.idLot = l.id
         GROUP BY l.id, r.libelle, l.nbFemelle, r.capaciteOeufs
         ORDER BY l.id`
      );
    return result.recordset;
  },

  async getCapaciteByLotAndDate(idLot, date) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLot', sql.Int, idLot)
      .input('date', sql.Date, date)
      .query(
        `SELECT
           l.id AS idLot,
           r.libelle AS race,
           l.nbFemelle,
           r.capaciteOeufs,
           (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) AS maxOeufs,
           ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0) AS oeufsObtenus,
           CASE
             WHEN (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) - ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0) < 0
               THEN 0
             ELSE (ISNULL(l.nbFemelle, 0) * ISNULL(r.capaciteOeufs, 0)) - ISNULL(SUM(CASE WHEN la.date <= @date THEN la.nbAtody ELSE 0 END), 0)
           END AS oeufsRestants
         FROM lot l
         JOIN race r ON r.id = l.idRace
         LEFT JOIN lotAtody la ON la.idLot = l.id
         WHERE l.id = @idLot
         GROUP BY l.id, r.libelle, l.nbFemelle, r.capaciteOeufs`
      );
    return result.recordset[0];
  },

  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT la.*, l.nb AS nbLot, r.libelle AS race,
              DATEADD(DAY, ISNULL(r.nbJourIncubation, 30), la.date) AS dateEclosion
       FROM lotAtody la
       JOIN lot l ON l.id = la.idLot
       JOIN race r ON r.id = l.idRace
       ORDER BY la.date DESC`
    );
    return result.recordset;
  },

  async setEclos(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query("IF COL_LENGTH('dbo.lotAtody', 'etat') IS NOT NULL UPDATE lotAtody SET etat = 1 WHERE id = @id");
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM lotAtody WHERE id = @id');
    return result.recordset[0];
  },

  async getByLot(idLot) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLot', sql.Int, idLot)
      .query('SELECT * FROM lotAtody WHERE idLot = @idLot');
    return result.recordset;
  },

  async create({ idLot, nbAtody, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLot', sql.Int, idLot)
      .input('nbAtody', sql.Int, nbAtody)
      .input('date', sql.Date, date)
      .query('INSERT INTO lotAtody (idLot, nbAtody, date) OUTPUT INSERTED.* VALUES (@idLot, @nbAtody, @date)');
    return result.recordset[0];
  },

  async update(id, { idLot, nbAtody, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idLot', sql.Int, idLot)
      .input('nbAtody', sql.Int, nbAtody)
      .input('date', sql.Date, date)
      .query('UPDATE lotAtody SET idLot=@idLot, nbAtody=@nbAtody, date=@date WHERE id=@id; SELECT * FROM lotAtody WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM lotAtody WHERE id = @id');
  },

  async updateNb(id, nbAtody) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('nbAtody', sql.Int, nbAtody)
      .query('UPDATE lotAtody SET nbAtody=@nbAtody WHERE id=@id');
  }
};

module.exports = LotAtody;
