const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // ou 'localhost' si PostgreSQL est installé localement
  database: 'TX',
  password: 'esther',
  port: 5432, // Le port par défaut de PostgreSQL est 5432
});

module.exports = pool;
