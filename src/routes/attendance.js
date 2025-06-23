const express = require('express');
const router = express.Router();
const controller = require('../app/controllers/AttendanceController');

router.get('/', controller.index);
router.post('/create', controller.create);
router.post('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);
router.get('/filter', controller.filter);

module.exports = router;
