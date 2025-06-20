const loginRouter = require('./login');
const homeRouter = require('./home');
const apiRouter = require('./api');
function route(app) {
    app.use('/login', loginRouter);

    app.use('/home', homeRouter);

    app.use('/api', router);
    app.use('/api', apiRouter);
}

const express = require('express');
const router = express.Router();

const Faculty = require('../app/models/Faculty');
const ClassModel = require('../app/models/Class');
const Student = require('../app/models/Student');
const Subject = require('../app/models/Subject');
const Grade = require('../app/models/Grade');

const generateRoutes = require('./generateRoutes');

router.use('/faculties', generateRoutes(Faculty, 'Faculty'));
router.use('/classes', generateRoutes(ClassModel, 'Class'));
router.use('/student', generateRoutes(Student, 'Student'));
router.use('/subject', generateRoutes(Subject, 'Subject'));
router.use('/grades', generateRoutes(Grade, 'Grade'));

// const classRoute = require('./class');
// router.use('/', classRoute);

module.exports = route;
