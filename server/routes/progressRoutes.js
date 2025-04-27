const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.get("/:username", progressController.getUserProgress);

module.exports = router;