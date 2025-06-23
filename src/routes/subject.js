const express = require('express');
const router = express.Router();
const SubjectController = require('../app/controllers/SubjectController');

router.get('/', SubjectController.index);
router.post('/create', SubjectController.create);
router.post('/update/:id', SubjectController.update);
router.post('/delete/:id', SubjectController.delete);
router.get('/search', SubjectController.search);

module.exports = router;