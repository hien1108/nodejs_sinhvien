const express = require('express');
const router = express.Router();
const Student = require('../app/models/Student');
const Teacher = require('../app/models/Teacher');
const FacultyController = require('../app/controllers/FacultyController');
const ClassController = require('../app/controllers/ClassController');
const StudentController = require('../app/controllers/StudentController');
const SubjectController = require('../app/controllers/SubjectController');
const GradeController = require('../app/controllers/GradeController');
const AttendanceController = require('../app/controllers/AttendanceController');

// Middleware kiểm tra đăng nhập cho API
function ensureAuthenticated(req, res, next) {
	console.log('🔐 Checking authentication:', {
		session: !!req.session,
		user: !!req.session?.user,
		sessionId: req.sessionID,
	});

	if (req.session && req.session.user) {
		console.log('✅ User authenticated:', req.session.user.name);
		return next();
	}

	console.log('❌ User not authenticated');
	res.status(401).json({ message: 'Unauthorized - Please login first' });
}

// API routes cho Faculty
router.post('/faculty/create', ensureAuthenticated, FacultyController.create);
router.post(
	'/faculty/update/:id',
	ensureAuthenticated,
	FacultyController.update
);
router.delete(
	'/faculty/delete/:id',
	ensureAuthenticated,
	FacultyController.delete
);

// API routes cho Class
router.post('/class/create', ensureAuthenticated, ClassController.create);
router.post('/class/update/:id', ensureAuthenticated, ClassController.update);
router.delete('/class/delete/:id', ensureAuthenticated, ClassController.delete);

// API routes cho Student
router.post('/student/create', ensureAuthenticated, StudentController.create);
router.post(
	'/student/update/:id',
	ensureAuthenticated,
	StudentController.update
);
router.delete(
	'/student/delete/:id',
	ensureAuthenticated,
	StudentController.delete
);
// Lấy sinh viên theo lớp
router.get(
	'/student/by-class/:classId',
	ensureAuthenticated,
	StudentController.getByClass
);

// API routes cho Subject
router.post('/subject/create', ensureAuthenticated, SubjectController.create);
router.post(
	'/subject/update/:id',
	ensureAuthenticated,
	SubjectController.update
);
router.delete(
	'/subject/delete/:id',
	ensureAuthenticated,
	SubjectController.delete
);

// API routes cho Grade
router.post('/grade/create', ensureAuthenticated, GradeController.create);
router.post('/grade/update/:id', ensureAuthenticated, GradeController.update);
router.delete('/grade/delete/:id', ensureAuthenticated, GradeController.delete);

// API routes cho Attendance
router.post(
	'/attendance/create',
	ensureAuthenticated,
	AttendanceController.create
);
router.post(
	'/attendance/update/:id',
	ensureAuthenticated,
	AttendanceController.update
);
router.delete(
	'/attendance/delete/:id',
	ensureAuthenticated,
	AttendanceController.delete
);

router.get('/chart-data', async (req, res) => {
	try {
		const data = {
			student: {
				CNTT: await Student.countDocuments({ major: 'CNTT' }),
				HTTT: await Student.countDocuments({ major: 'HTTT' }),
				KHMT: await Student.countDocuments({ major: 'KHMT' }),
			},
			teacher: {
				CNTT: await Teacher.countDocuments({ major: 'CNTT' }),
				HTTT: await Teacher.countDocuments({ major: 'HTTT' }),
				KHMT: await Teacher.countDocuments({ major: 'KHMT' }),
			},
		};
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/student/search', async (req, res) => {
	const { keyword } = req.query;
	if (!keyword) return res.json([]);
	try {
		const students = await Student.find({
			$or: [
				{ name: { $regex: keyword, $options: 'i' } },
				{ studentId: { $regex: keyword, $options: 'i' } },
			],
		}).limit(10);
		res.json(students);
	} catch (err) {
		res.status(500).json({ error: 'Lỗi tìm sinh viên' });
	}
});

module.exports = router;
