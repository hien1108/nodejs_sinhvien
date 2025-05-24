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

// Áp dụng middleware trước khi render trang home
// router.get('/', ensureAuthenticated, (req, res) => {
//   res.render('home', { user: req.session.user });  // Truyền thêm user nếu cần hiển thị
// });

router.get('/home', ensureAuthenticated, (req, res) => {
  res.render('home', { user: req.session.user });  
});

// router.use('/search', siteController.search);
// router.use('/', siteController.index);

module.exports = router;
