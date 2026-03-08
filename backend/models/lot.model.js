const { getPool, sql } = require('../config/db');

const Lot = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT l.*, r.libelle AS race
       FROM lot l
       JOIN race r ON r.id = l.idRace
       ORDER BY l.date DESC`
    );
    return result.recordset;
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM lot WHERE id = @id');
    return result.recordset[0];
  },

  async create({ idRace, nb, age, date, idLotAtody = null }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('idRace', sql.Int, idRace)
      .input('nb', sql.Int, nb)
      .input('age', sql.Int, age)
      .input('date', sql.Date, date)
      .input('idLotAtody', sql.Int, idLotAtody)
      .query('INSERT INTO lot (idRace, nb, age, date, idLotAtody) OUTPUT INSERTED.* VALUES (@idRace, @nb, @age, @date, @idLotAtody)');
    return result.recordset[0];
  },

  async update(id, { idRace, nb, age, date }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('idRace', sql.Int, idRace)
      .input('nb', sql.Int, nb)
      .input('age', sql.Int, age)
      .input('date', sql.Date, date)
      .query('UPDATE lot SET idRace=@idRace, nb=@nb, age=@age, date=@date WHERE id=@id; SELECT * FROM lot WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM lot WHERE id = @id');
  }
};

module.exports = Lot;
