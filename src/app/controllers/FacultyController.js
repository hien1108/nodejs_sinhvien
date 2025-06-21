const Faculty = require('../models/Faculty');

class FacultyController {
    async index(req,res) {
        try {
            const faculties = await Faculty.find({});
            res.render('partials/khoa', {
                layout: 'home', 
                user: req.session.user,
                faculties
            });
        } catch (error) {
            console.error('lỗi lấy dữu liệu khoa:', error);
            res.status(500).send('Lỗi server');
        }
    }
}

module.exports = new FacultyController();