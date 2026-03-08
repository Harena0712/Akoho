const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Harena0712',
  server: 'localhost',
  database: 'AkohoDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

module.exports = { sql, getPool, config };
