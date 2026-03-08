const { getPool, sql } = require('../config/db');

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
