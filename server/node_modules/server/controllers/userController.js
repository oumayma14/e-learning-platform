const db =require('../config/db'); //db importation

const getAllUsers = (req, res) => {
    const query = 'SELECT username, score from user ORDER BY score DESC LIMIT 10 ';


    db.query(query, (err,results) => {
        if(err) {
            return res.status(500).json({error: 'DB query failed'});
        }
        res.json(results);
    });
};
module.exports = {getAllUsers};