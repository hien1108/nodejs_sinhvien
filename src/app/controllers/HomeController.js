const User = require('../models/user');


class HomeController {
    
    //GET /news
    index(req, res) {
       const user = req.session.user;

        res.render('home',{
            layout: 'main',
            user
        });
    }


}

module.exports = new HomeController();

