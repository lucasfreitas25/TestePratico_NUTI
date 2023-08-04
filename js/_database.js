const { Client } = require('pg');

// Passa as configurações do banco
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'testePratico',
  password: '2515',
  port: 5432,
});

module.exports = db;
