const db = require('../config/db');

// Registration logic
const register = (req, res) => {
    const sentUsername = req.body.Username;
    const sentName = req.body.Name;
    const sentEmail = req.body.Email;
    const sentPassword = req.body.Password;
    const sentRole = req.body.Role;

    const SQL = 'INSERT INTO user (username, name, email, password, role) VALUES (?,?,?,?,?)';
    const Values = [sentUsername, sentName, sentEmail, sentPassword, sentRole];

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            console.log('User inserted successfully!');
            res.send({ message: 'User added!' });
        }
    });
};

// Login logic
const login = (req, res) => {
    const sentloginEmail = req.body.LoginEmail;
    const sentloginPassword = req.body.LoginPassword;

    const SQL = 'SELECT * FROM user WHERE email = ? && password = ?';
    const Values = [sentloginEmail, sentloginPassword];

    db.query(SQL, Values, (err, results) => {
        if (err) {
            res.send({ error: err });
        } else if (results.length > 0) {
            res.send(results);
        } else {
            res.send({ message: "Credentials don't match!" });
        }
    });
};

module.exports = { register, login };
