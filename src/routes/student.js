const express = require('express');
const router = express.Router();
const studentController = require('../app/controllers/StudentController');

// Route trang chính
router.get('/', studentController.index);

// API xử lý CRUD
router.post('/create', studentController.create);
router.post('/update/:id', studentController.update);
router.delete('/delete/:id', studentController.delete);

// API tìm kiếm
router.get('/search', studentController.search);

module.exports = router;




