class LoginController {
    //GET /news
    index(req, res) {
        res.render('login');
    }

    //GET /news/:slug
    show(req, res) {
        res.send('new detail!!!');
    }
}

module.exports = new LoginController();
