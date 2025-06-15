const User = require('../models/user');


class HomeController {
    
    //GET /news
    index(req, res) {
       
        res.render('home');
    }


}

module.exports = new HomeController();

