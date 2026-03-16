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

  async create({
    libelle,
    puGg,
    pvGg,
    prixAtody,
    capaciteOeufs,
    male,
    femelle,
    oeufPourri,
    mortMale,
    mortFemelle,
    nbJourIncubation
  }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('libelle', sql.VarChar(100), libelle)
      .input('puGg', sql.Float, puGg)
      .input('pvGg', sql.Float, pvGg)
      .input('prixAtody', sql.Float, prixAtody)
      .input('capaciteOeufs', sql.Int, capaciteOeufs)
      .input('male', sql.Int, male)
      .input('femelle', sql.Int, femelle)
      .input('oeufPourri', sql.Int, oeufPourri)
      .input('mortMale', sql.Int, mortMale)
      .input('mortFemelle', sql.Int, mortFemelle)
      .input('nbJourIncubation', sql.Int, nbJourIncubation)
      .query('INSERT INTO race (libelle, puGg, pvGg, prixAtody, capaciteOeufs, male, femelle, oeufPourri, mortMale, mortFemelle, nbJourIncubation) OUTPUT INSERTED.* VALUES (@libelle, @puGg, @pvGg, @prixAtody, @capaciteOeufs, @male, @femelle, @oeufPourri, @mortMale, @mortFemelle, @nbJourIncubation)');
    return result.recordset[0];
  },

  async update(id, {
    libelle,
    puGg,
    pvGg,
    prixAtody,
    capaciteOeufs,
    male,
    femelle,
    oeufPourri,
    mortMale,
    mortFemelle,
    nbJourIncubation
  }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('libelle', sql.VarChar(100), libelle)
      .input('puGg', sql.Float, puGg)
      .input('pvGg', sql.Float, pvGg)
      .input('prixAtody', sql.Float, prixAtody)
      .input('capaciteOeufs', sql.Int, capaciteOeufs)
      .input('male', sql.Int, male)
      .input('femelle', sql.Int, femelle)
      .input('oeufPourri', sql.Int, oeufPourri)
      .input('mortMale', sql.Int, mortMale)
      .input('mortFemelle', sql.Int, mortFemelle)
      .input('nbJourIncubation', sql.Int, nbJourIncubation)
      .query('UPDATE race SET libelle=@libelle, puGg=@puGg, pvGg=@pvGg, prixAtody=@prixAtody, capaciteOeufs=@capaciteOeufs, male=@male, femelle=@femelle, oeufPourri=@oeufPourri, mortMale=@mortMale, mortFemelle=@mortFemelle, nbJourIncubation=@nbJourIncubation WHERE id=@id; SELECT * FROM race WHERE id=@id');
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
