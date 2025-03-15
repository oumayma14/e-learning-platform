const mysql = require('mysql');

const db = mysql.createConnection({
    user: 'root', 
    host: 'localhost',
    password: '',
    database: 'elearn'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

module.exports = db;
