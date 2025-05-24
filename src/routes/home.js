const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/HomeController');

// Middleware kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // Cho phép tiếp tục
  }
  res.redirect('/login'); // Nếu chưa đăng nhập, chuyển về trang login
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', { user: req.session.user });  
});

module.exports = router;
