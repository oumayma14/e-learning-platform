const express = require('express');
const router = express.Router();
const formateurController = require('../controllers/formateur.controller'); // <- CORRECT

// Exemple correct
router.post('/register', formateurController.register);
router.post('/login', formateurController.login);

// Autres routes
router.get('/:id', formateurController.getFormateur);
router.put('/:id', formateurController.updateFormateur);
router.delete('/:id', formateurController.deleteFormateur);
// Add this line to the existing routes
router.get('/:formateurId/leaderboard/:quizId', formateurController.getLeaderboard);


module.exports = router;
