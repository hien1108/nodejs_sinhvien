const User = require('../models/user');


class HomeController {
    
    //GET /home
    index(req, res) {
        res.render('partials/trangchu',{
            layout: 'home',
            user: req.session.user,
        });
    }
    //GET/home/partial/:page
    partial( req, res) {
        const page = req.params.page;
        const validPages = ['trangchu', 'khoa', 'lop', 'sinhvien', 'quanlymonhoc', 'quanlydiem'];

        if(!validPages.includes(page)) {
            return res.status(404).send('khong tim thay noi dung');
        }

        res.render(`partials/${page}`, {
            layout: false,
            user: req.session.user
        });
    }


}

module.exports = new HomeController();

