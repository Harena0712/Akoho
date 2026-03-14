const { getPool, sql } = require('../config/db');

const DAY_MS = 1000 * 60 * 60 * 24;

function normalizeDate(value) {
  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === 'string') {
    const parts = value.split('-').map(Number);
    if (parts.length === 3 && parts.every(Number.isFinite)) {
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Date invalide');
  }

  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function joursEntre(dateDebut, dateFin) {
  const debut = normalizeDate(dateDebut);
  const fin = normalizeDate(dateFin);
  return Math.max(0, Math.floor((fin - debut) / DAY_MS));
}

function calculPoidsExact(listConfSakafo, ageSemaines) {
  if (ageSemaines < 0 || !listConfSakafo || listConfSakafo.length === 0) return 0;

  const ordered = listConfSakafo.slice().sort((a, b) => a.age - b.age);

  const semainesCompletes = Math.floor(ageSemaines);
  const fraction = ageSemaines - semainesCompletes;

  let total = 0;
  let index = 0;
  let currentConf = null;

  for (let semaine = 0; semaine <= semainesCompletes; semaine++) {
    while (index < ordered.length && ordered[index].age <= semaine) {
      currentConf = ordered[index];
      index++;
    }
    total += currentConf ? currentConf.variationPoid : 0;
  }

  if (fraction > 0) {
    while (index < ordered.length && ordered[index].age <= (semainesCompletes + 1)) {
      currentConf = ordered[index];
      index++;
    }
    total += currentConf ? currentConf.variationPoid * fraction : 0;
  }

  return Math.round(total * 100) / 100;
}

function calculSakafoConsommeExact(listConfSakafo, ageSemaines) {
  if (ageSemaines < 0 || !listConfSakafo || listConfSakafo.length === 0) return 0;

  const ordered = listConfSakafo.slice().sort((a, b) => a.age - b.age);
  const semainesCompletes = Math.floor(ageSemaines);
  const fraction = ageSemaines - semainesCompletes;

  let total = 0;
  let index = 0;
  let currentConf = null;

  for (let semaine = 0; semaine <= semainesCompletes; semaine++) {
    while (index < ordered.length && ordered[index].age <= semaine) {
      currentConf = ordered[index];
      index++;
    }
    total += currentConf ? currentConf.sakafoG : 0;
  }

  if (fraction > 0) {
    while (index < ordered.length && ordered[index].age <= (semainesCompletes + 1)) {
      currentConf = ordered[index];
      index++;
    }
    total += currentConf ? currentConf.sakafoG * fraction : 0;
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
    const raceId = Number(race);
    if (!Number.isInteger(raceId) || raceId <= 0) {
      throw new Error('Race invalide');
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('idRace', sql.Int, raceId)
      .query('SELECT * FROM confSakafo WHERE idRace = @idRace ORDER BY age');

    const listConfSakafo = result.recordset;
    const jours = joursEntre(dateDebut, dateFin);
    const ageSemaines = jours / 7;
    const poids = calculPoidsExact(listConfSakafo, ageSemaines);
    const sakafoConsomme = calculSakafoConsommeExact(listConfSakafo, ageSemaines);

    return {
      race: raceId,
      dateDebut,
      dateFin,
      jours,
      ageSemaines: Math.round(ageSemaines * 100) / 100,
      poids,
      sakafoConsomme
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
