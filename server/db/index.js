const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://e_world_backend_user:z4EmEXbMCIcQsdNVICpjwSx85LiYgSUr@dpg-cuqjoedumphs73es9vk0-a.oregon-postgres.render.com/e_world_backend",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };