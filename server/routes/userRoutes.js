const express = require('express');
const {getAllUsers, deleteUser, updateUser} = require('../controllers/userController');
const {getUsers} = require('../controllers/userController');

const  router = express.Router();

router.get('/users', getUsers); // shows all the user 
router.put('/update/:username', updateUser);
router.delete('/delete/:username', deleteUser) //delete user 
router.get('/leaderboard', getAllUsers); //show leaderboard users

module.exports = router;