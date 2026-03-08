const { getPool, sql } = require('../config/db');

const Race = {
  async getAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM race');
    return result.recordset;
  },

  async getById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM race WHERE id = @id');
    return result.recordset[0];
  },

  async create({ libelle, puGg, pvGg, prixAtody }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('libelle', sql.VarChar(100), libelle)
      .input('puGg', sql.Float, puGg)
      .input('pvGg', sql.Float, pvGg)
      .input('prixAtody', sql.Float, prixAtody)
      .query('INSERT INTO race (libelle, puGg, pvGg, prixAtody) OUTPUT INSERTED.* VALUES (@libelle, @puGg, @pvGg, @prixAtody)');
    return result.recordset[0];
  },

  async update(id, { libelle, puGg, pvGg, prixAtody }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('libelle', sql.VarChar(100), libelle)
      .input('puGg', sql.Float, puGg)
      .input('pvGg', sql.Float, pvGg)
      .input('prixAtody', sql.Float, prixAtody)
      .query('UPDATE race SET libelle=@libelle, puGg=@puGg, pvGg=@pvGg, prixAtody=@prixAtody WHERE id=@id; SELECT * FROM race WHERE id=@id');
    return result.recordset[0];
  },

  async delete(id) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM race WHERE id = @id');
  }
};

module.exports = Race;
