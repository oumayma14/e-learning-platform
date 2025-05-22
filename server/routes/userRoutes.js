const express = require('express');
const {getAllUsers, deleteUser, updateUser} = require('../controllers/userController');
const {getUsers} = require('../controllers/userController');
const db =require('../config/db'); 
const  router = express.Router();

router.get('/users', getUsers); // shows all the user 
router.put('/update/:username', updateUser);
router.delete('/delete/:username', deleteUser) //delete user 
router.get('/leaderboard', getAllUsers); //show leaderboard users

// Get a single user by username (returns the email)
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await db.query('SELECT email FROM learners WHERE username = ?', [username]);

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user email" });
    }
});

module.exports = router;