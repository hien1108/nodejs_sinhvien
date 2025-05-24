const User = require('../models/user');


class HomeController {
    
    //GET /news
    index(req, res) {
        // Student.find({})
        //     .then(students => {
        //         res.json(students); // hoặc render ra view nếu cần
        // })
        //     .catch(err => {
        //         res.status(500).send(err.message);
        // });
        res.render('home');
    }

//     //GET /search
//     search(req, res) {
//         res.render('search');
//     }
}

module.exports = new HomeController();

