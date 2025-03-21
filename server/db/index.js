const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://e_world_backend_xz60_user:GcEfRv1wKNUblYAONmtostYIwZjlKKqO@dpg-cveuemhc1ekc73bvpbcg-a.oregon-postgres.render.com/e_world_backend_xz60",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };