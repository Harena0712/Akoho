const { getPool, sql } = require('../config/db');

const LotAtody = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT la.*, l.nb AS nbLot, r.libelle AS race
       FROM lotAtody la
       JOIN lot l ON l.id = la.idLot
       JOIN race r ON r.id = l.idRace
       ORDER BY la.date DESC`
    );
    return result.recordset;
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
