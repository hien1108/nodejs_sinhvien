const express = require('express');
const router = express.Router();
const ClassController = require('../app/controllers/ClassController');

router.get('/', ClassController.index);
router.post('/lop/create', ClassController.create);
router.post('/lop/update/:id', ClassController.update);
router.delete('/lop/delete/:id', ClassController.delete);

module.exports = router;
