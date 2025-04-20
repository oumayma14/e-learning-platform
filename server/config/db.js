const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "elearn",
});

// Promisify for Node.js async/await
pool.query = util.promisify(pool.query);
pool.getConnection = util.promisify(pool.getConnection);

module.exports = pool;
