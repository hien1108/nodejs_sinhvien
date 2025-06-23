const loginRouter = require('./login');
const homeRouter = require('./home');
const apiRouter = require('./api');
const facultyRouter = require('./faculty');
const classRouter = require('./class');
const studentRouter = require('./student');
const subjectRouter = require('./subject');
const attendanceRouter = require('./attendance');
const gradeRouter = require('./grade');
function route(app) {
	app.use('/login', loginRouter);

	app.use('/home', homeRouter);

	app.use('/api', apiRouter);

	app.use('/khoa', facultyRouter);

	app.use('/lop', classRouter);

	app.use('/sinhvien', studentRouter);

	app.use('/quanlymonhoc', subjectRouter);

	app.use('/quanlydiem', gradeRouter);

	app.use('/diemdanh', attendanceRouter);

	app.use('/attendance', attendanceRouter); // Thêm route /attendance cho compatibility

	// Route logout ở root level
	app.post('/logout', (req, res) => {
		console.log('🚪 User logging out...');

		// Xóa session
		req.session.destroy((err) => {
			if (err) {
				console.error('❌ Error destroying session:', err);
				return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
			}

			// Xóa cookie session
			res.clearCookie('connect.sid');
			console.log('✅ Session destroyed successfully');

			res.json({ message: 'Đăng xuất thành công' });
		});
	});
}

// const express = require('express');
// const router = express.Router();

// const Faculty = require('../app/models/Faculty');
// const ClassModel = require('../app/models/Class');
// const Student = require('../app/models/Student');
// const Subject = require('../app/models/Subject');
// const Grade = require('../app/models/Grade');

// const generateRoutes = require('./generateRoutes');

// router.use('/faculties', generateRoutes(Faculty, 'Faculty'));
// router.use('/classes', generateRoutes(ClassModel, 'Class'));
// router.use('/student', generateRoutes(Student, 'Student'));
// router.use('/subject', generateRoutes(Subject, 'Subject'));
// router.use('/grades', generateRoutes(Grade, 'Grade'));

// // const classRoute = require('./class');
// // router.use('/', classRoute);

module.exports = route;
