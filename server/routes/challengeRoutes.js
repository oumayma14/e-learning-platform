const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.post('/create', challengeController.createChallenge);
router.post('/join/:id', challengeController.joinChallenge);
router.post('/submit/:id', challengeController.submitChallengerScore);

router.get('/by-code/:code', challengeController.getChallengeByCode);
router.get('/all', challengeController.getAllChallenges);

router.get('/:id', challengeController.getChallengeById);

module.exports = router;
