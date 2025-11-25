const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "220401",
  database: "badminton_shop1",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
module.exports = pool;
