const db =require('../config/db'); //db importation


// (leaderboard users)
const getAllUsers = (req, res) => {
    const query = 'SELECT username, score, image from user ORDER BY score DESC LIMIT 10 ';


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

module.exports = {getAllUsers, getUsers, deleteUser};