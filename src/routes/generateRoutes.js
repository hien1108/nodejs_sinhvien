const express = require('express');
const controller = require('../app/controllers/GenericController');

module.exports = function generateRoutes(Model, modelName) {
    const router = express.Router();

    //Định nghĩa các trường cần populate dểd trả về dữ liệu liên quan
    let populateFields = [];
    switch (modelName) {
        case 'Class':
            populateFields = ['faculty'];
            break;
        case 'student':
            populateFields = ['class'];
            break;
        case 'Grade':
            populateFields = ['student', 'subject'];
            break;
        default:
            populateFields = [];
    }

    router.post('/', controller.create(Model));
    router.get('/', controller.getAll(Model, populateFields));
    router.get('/:id', controller.getOne(Model, populateFields));
    router.put('/:id', controller.update(Model));
    router.delete('/:id', controller.remove(Model));

    return router;
};