const express = require('express');
const router = express.Router();

const FacultyController = require('../app/controllers/FacultyController');

//kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
    if(req.session && req.session.user) return next();
    res.redirect('/login');
}

router.get('/', ensureAuthenticated, FacultyController.index);

module.exports = router;
