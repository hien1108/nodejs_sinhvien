const express = require('express');
const router = express.Router();
const LoginController = require('../app/controllers/LoginController');

//router.get('/:slug', loginController.show);

//Get để hiển thị trang loginlogin
router.get('/', (req, res) => {
	res.render('login');
});
// router.get('/favicon.ico', (req, res) => res.status(204).end()); // chặn favicon

//POST để xủ lý đăng nhập
router.post('/', LoginController.handleLogin);

module.exports = router;
