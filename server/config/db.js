const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10, // Max simultaneous connections
  host: "localhost",
  user: "root",
  password: "",
  database: "elearn",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("**Connected to MySQL database.");
    connection.release(); 
  }
});

module.exports = pool;
