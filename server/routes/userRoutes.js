const express = require('express');
const {getAllUsers, deleteUser} = require('../controllers/userController');
const {getUsers} = require('../controllers/userController');

const  router = express.Router();

router.get('/users', getUsers); // shows all the user 
router.delete('/users/:username', deleteUser) //delete user 
router.get('/leaderboard', getAllUsers); //show leaderboard users

module.exports = router;