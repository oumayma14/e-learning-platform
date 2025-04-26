const db =require('../config/db'); //db importation
const util = require('util');
db.query= util.promisify(db.query);


// (leaderboard users)
const getAllUsers = (req, res) => {
    const query = 'SELECT username, score, image FROM user  ORDER BY score DESC LIMIT 10';
    db.query(query, (err,results) => {
        if(err) {
            return res.status(500).json({error: 'DB query failed'});
        }
        res.json(results);
    });
};

//CRUD OPERATIONS

//Read
const getUsers = (req,res) =>{
    const SQL = "SELECT username, name, email, role , score FROM user";
    db.query(SQL,(err,results)=>{
        if(err) return res.status(500).json({error:err});
        res.status(200).json(results);
    });
};
//update
const bcrypt = require('bcrypt');
const { error } = require('console');

const updateUser = async (req, res) => {
    const { username } = req.params;
    const { name, email, role, score, password } = req.body; 

    try {
        const getUserSQL = "SELECT * FROM user WHERE username = ?";
        const userResults = await db.query(getUserSQL, [username]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingUser = userResults[0];
        const updatedName = name || existingUser.name;
        const updatedEmail = email || existingUser.email;
        const updatedRole = role || existingUser.role;
        const updatedScore = score !== undefined ? parseInt(score, 10) : existingUser.score;

        let updateSQL = "UPDATE user SET name = ?, email = ?, role = ?, score = ? WHERE username = ?";
        let queryParams = [updatedName, updatedEmail, updatedRole, updatedScore, username];

        if (password) { 
            const hashedPassword = await bcrypt.hash(password, 10);
            updateSQL = "UPDATE user SET name = ?, email = ?, password = ?, role = ?, score = ? WHERE username = ?";
            queryParams = [updatedName, updatedEmail, hashedPassword, updatedRole, updatedScore, username];
        }

        await db.query(updateSQL, queryParams);
        res.status(200).json({ message: `User '${username}' updated successfully` });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

//Delete

const deleteUser = (req,res) =>{
    const { username } = req.params;
    const SQL = "DELETE FROM user WHERE username = ?";

    db.query(SQL, [username], (err,result) =>{
        if(err) return res.status(500).json({error: err});
        if(result.affectedRows === 0) {
            return res.status(404).json({message: "user not found !"});
        }
        res.status(200).json({message: `User' ${username}'deleted successfully`});
    });
};

//update user score 
const updateUserScore = async(username, scoreToAdd) =>{
    const [user] = await db.query('SELECT score FROM user WHERE username = ?', [username]);
    if (!user) {
        throw new Error('User not found');
    }
    const newScore = user.score + scoreToAdd;
    await db.query('UPDATE user SET score = ? WHERE username = ?', [newScore, username]);
    return newScore; 
};

module.exports = {getAllUsers, getUsers, deleteUser, updateUser, updateUserScore};