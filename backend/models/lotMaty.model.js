const { getPool, sql } = require('../config/db');

const LotMaty = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT lm.*, l.nb AS nbLot, r.libelle AS race
       FROM lotMaty lm
       JOIN lot l ON l.id = lm.idLot
       JOIN race r ON r.id = l.idRace
       ORDER BY lm.date DESC`
    );
    return result.recordset;
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM lotMaty WHERE id = @id');
    return result.recordset[0];
  },

  async getByLot(idLot) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLot', sql.Int, idLot)
      .query('SELECT * FROM lotMaty WHERE idLot = @idLot');
    return result.recordset;
  },

  async create({ idLot, nbMaty, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idLot', sql.Int, idLot)
      .input('nbMaty', sql.Int, nbMaty)
      .input('date', sql.Date, date)
      .query('INSERT INTO lotMaty (idLot, nbMaty, date) OUTPUT INSERTED.* VALUES (@idLot, @nbMaty, @date)');
    return result.recordset[0];
  },

  async update(id, { idLot, nbMaty, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idLot', sql.Int, idLot)
      .input('nbMaty', sql.Int, nbMaty)
      .input('date', sql.Date, date)
      .query('UPDATE lotMaty SET idLot=@idLot, nbMaty=@nbMaty, date=@date WHERE id=@id; SELECT * FROM lotMaty WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM lotMaty WHERE id = @id');
  }
};

module.exports = LotMaty;
