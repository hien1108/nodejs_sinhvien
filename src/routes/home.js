const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

// Middleware kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // Cho phép tiếp tục
  }
  res.redirect('/login'); // Nếu chưa đăng nhập, chuyển về trang login
}

//Trang chính sau khi đăng nhập
 router.get('/', ensureAuthenticated, homeController.index); 

//Router lấy nội dung từng partials qua JS
router.get('/partials/:page', ensureAuthenticated, homeController.partial);




module.exports = router;
