const express = require('express');
const router = express.Router();
const controller = require('../app/controllers/GradeController');

router.get('/', controller.index);

module.exports = router;