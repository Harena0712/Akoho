const { getPool, sql } = require('../config/db');

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
