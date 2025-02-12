const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:d-moneytucker@localhost:5432/e_backend_db",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };