const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "shnoor_lms",
  password: "281103",
  port: 5432,
});
module.exports = pool;