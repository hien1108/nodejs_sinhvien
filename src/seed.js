const mongoose = require('mongoose');
const User = require('./app/models/user');
const Student = require('./app/models/Student');
const Faculty = require('./app/models/Faculty');
const Grade = require('./app/models/Grade');
const ClassModel = require('./app/models/Class');
const Subject = require('./app/models/Subject');
const Teacher = require('./app/models/Teacher');
const Attendance = require('./app/models/Attendance');

mongoose
	.connect(
		'mongodb://localhost:27017/quan_ly_sinh_vien_dev'
		// , {  useNewUrlParser: true,
		//   useUnifiedTopology: true
		// }
	)
	.then(async () => {
		console.log('Connected MongoDB');

		// Xóa dữ liệu cũ
		await User.deleteMany({});
		await Faculty.deleteMany({});
		await ClassModel.deleteMany({});
		await Student.deleteMany({});
		await Teacher.deleteMany({});
		await Subject.deleteMany({});
		await Grade.deleteMany({});
		await Attendance.deleteMany({});
		await Attendance.deleteMany({
			$or: [{ student: null }, { class: null }],
		});

		//seed Faculty
		const faculties = await Faculty.insertMany([
			{ maKhoa: 'CNTT', tenKhoa: 'Công nghệ thông tin' },
			{ maKhoa: 'HTTT', tenKhoa: 'Hệ thống thông tin' },
			{ maKhoa: 'KHMT', tenKhoa: 'Khoa học máy tính' },
		]);
		console.log('Faculty data seed');
		console.log(
			'Faculty:',
			faculties.map((f) => ({ maKhoa: f.maKhoa, _id: f._id }))
		);

		//seed Teacher
		const teachers = await Teacher.insertMany([
			{
				teacherId: 'GV001',
				name: 'Thầy Nguyễn Văn Hùng',
				major: 'CNTT',
				email: 'nvhung@vnua.edu.vn',
				phone: '0388545965',
				faculty: faculties[0]._id,
			},
			{
				teacherId: 'GV002',
				name: 'Cô Nguyễn Thùy Linh',
				major: 'HTTT',
				email: 'ntlinh@vnua.edu.vn',
				phone: '0828144526',
				faculty: faculties[1]._id,
			},
			{
				teacherId: 'GV003',
				name: 'Thầy Nguyễn Văn Bình',
				major: 'KHMT',
				email: 'nvbinh@vnua.edu.vn',
				phone: '0354134255',
				faculty: faculties[2]._id,
			},
			{
				teacherId: 'GV004',
				name: 'Cô Nguyễn Thị Huệ',
				major: 'CNTT',
				email: 'nthue@vnua.edu.vn',
				phone: '0326416882',
				faculty: faculties[0]._id,
			},
			{
				teacherId: 'ADMIN',
				name: 'Quản trị viên',
				major: 'Quản trị',
				email: 'admin@vnua.edu.vn',
				phone: '0978521335',
				faculty: faculties[0]._id,
			},
		]);
		console.log('Teacher data seed');

		//Seed User (Teachers)
		const users = [
			{
				teacherId: 'GV001',
				password: '123456',
				name: 'Thầy Nguyễn Văn Hùng',
				role: 'teacher',
				teacher: teachers[0]._id,
			},
			{
				teacherId: 'GV002',
				password: '234567',
				name: 'Cô Nguyễn Thùy Linh',
				role: 'teacher',
				teacher: teachers[1]._id,
			},
			{
				teacherId: 'GV003',
				password: '678910',
				name: 'Thầy Nguyễn Văn Bình',
				role: 'teacher',
				teacher: teachers[2]._id,
			},
			{
				teacherId: 'GV004',
				password: 'GV004',
				name: 'Cô Nguyễn Thị Huệ',
				role: 'teacher',
				teacher: teachers[3]._id,
			},
			{
				teacherId: 'ADMIN',
				password: 'admin123',
				name: 'Quản trị viên',
				role: 'admin',
				teacher: teachers[4]._id,
			},
		];
		await User.insertMany(users);
		console.log('User data seed');

		//seed class
		const classSeed = [
			{
				maLop: 'CNTTA',
				tenLop: 'Công nghệ thông tin A',
				faculty: faculties[0]._id,
			},
			{
				maLop: 'CNTTB',
				tenLop: 'Công nghệ thông tin B',
				faculty: faculties[0]._id,
			},
			{
				maLop: 'HTTTA',
				tenLop: 'Hệ thống thông tin A',
				faculty: faculties[1]._id,
			},
			{
				maLop: 'HTTTB',
				tenLop: 'Hệ thống thông tin B',
				faculty: faculties[1]._id,
			},
			{
				maLop: 'KHMTA',
				tenLop: 'Khoa học máy tính A',
				faculty: faculties[2]._id,
			},
			{
				maLop: 'KHMTB',
				tenLop: 'Khoa học máy tính B',
				faculty: faculties[2]._id,
			},
		];
		console.log('Class seed preview:', JSON.stringify(classSeed, null, 2));
		const invalidClasses = classSeed.filter((c) => !c.maLop);
		console.log('Invalid classes:', invalidClasses);

		await ClassModel.deleteMany({});
		const classes = await ClassModel.insertMany(classSeed);
		console.log('class data seed');

		//seed Student
		const students = await Student.insertMany([
			{
				studentId: '671417',
				name: 'Nguyễn Thế Hiển',
				dob: new Date('2004-08-11'),
				gender: 'Nam',
				email: '671417@sv.vnua.edu.vn',
				phone: '0388545965',
				address: 'Bắc Ninh',
				maKhoa: faculties[0]._id,
				class: classes[0]._id,
			},
			{
				studentId: '671802',
				name: 'Tạ Hữu Quân',
				dob: new Date('2004/08/26'),
				gender: 'Nam',
				email: '671802@sv.vnua.edu.vn',
				phone: '0828144526',
				address: 'Sơn La',
				maKhoa: faculties[0]._id,
				class: classes[1]._id,
			},
			{
				studentId: '671123',
				name: 'Nguyễn Văn An',
				dob: new Date('2004-05-16'),
				gender: 'Nam',
				email: '671123@sv.vnua.edu.vn',
				phone: '0354134255',
				address: 'Hà Nam',
				maKhoa: faculties[1]._id,
				class: classes[4]._id,
			},
			{
				studentId: '671526',
				name: 'Lê Thị Loan',
				dob: new Date('2004-01-25'),
				gender: 'Nữ',
				email: '671526@sv.vnua.edu.vn',
				phone: '0326416882',
				address: 'Hà Nội',
				maKhoa: faculties[1]._id,
				class: classes[3]._id,
			},
			{
				studentId: '671426',
				name: 'Trần Thị Hiền',
				dob: new Date('2004-11-10'),
				gender: 'Nữ',
				email: '671426@sv.vnua.edu.vn',
				phone: '0978521335',
				address: 'Hải Phòng',
				maKhoa: faculties[2]._id,
				class: classes[5]._id,
			},
		]);
		console.log('Student data seed');

		//seed subject
		const subjects = await Subject.insertMany([
			{ maMon: 'CSDL', tenMon: 'Cơ sở dữ liệu', tinChi: 3 },
			{ maMon: 'LTHDT', tenMon: 'Lập trình hướng đối tượng', tinChi: 3 },
			{ maMon: 'TTNT', tenMon: 'Trí tuệ nhân tạo', tinChi: 3 },
			{
				maMon: 'HQTCSDL',
				tenMon: 'Hệ quản trị cơ sở dữ liệu',
				tinChi: 3,
			},
			{ maMon: 'KTLT', tenMon: 'kỹ thuật lập trình', tinChi: 3 },
			{
				maMon: 'THCTDL&GT',
				tenMon: 'Thực hành cấu trúc dữ liệu và giải thuật',
				tinChi: 4,
			},
			{ maMon: 'NLHDT', tenMon: 'Nguyên lý hệ điều hành', tinChi: 3 },
			{ maMon: 'LTJ', tenMon: 'Lập trình Java', tinChi: 3 },
			{ maMon: 'QTM', tenMon: 'Quản trị mạng', tinChi: 3 },
			{ maMon: 'LTM', tenMon: 'Lập trình mạng', tinChi: 3 },
		]);
		console.log('Subject data seed');

		//seed Grade
		await Grade.insertMany([
			{
				student: students[0]._id,
				subject: subjects[0]._id,
				diemQT: 7.5,
				diemThi: 8.5,
				diemTK: 8.0,
				xepLoai: 'Giỏi',
			},
			{
				student: students[3]._id,
				subject: subjects[0]._id,
				diemQT: 7.5,
				diemThi: 8.5,
				diemTK: 8.0,
				xepLoai: 'Giỏi',
			},
			{
				student: students[1]._id,
				subject: subjects[3]._id,
				diemQT: 7.5,
				diemThi: 8.5,
				diemTK: 8.0,
				xepLoai: 'Giỏi',
			},
			{
				student: students[2]._id,
				subject: subjects[4]._id,
				diemQT: 7.5,
				diemThi: 8.5,
				diemTK: 8.0,
				xepLoai: 'Giỏi',
			},
		]);
		console.log('Grade data seed');

		await Attendance.insertMany([
			{
				date: new Date('2025-04-20'),
				class: classes[0]._id,
				student: students[0]._id,
				status: 'present',
				note: 'Đúng giờ',
			},
			{
				date: new Date('2025-04-20'),
				class: classes[1]._id,
				student: students[1]._id,
				status: 'present',
				note: 'Muộn 30 phút',
			},
		]);
		console.log('Attendance data seed');
	})

	// .then(() => {
	//     console.log(' User data seeded successfully');
	//     return mongoose.connection.close();
	//   })
	.catch((err) => {
		console.error('Error seeding User data:', err);
	})

	.finally(() => {
		mongoose.connection.close();
	});

// User.insertMany(users)
//   .then(() => {
//     console.log('Seeded data');
//     mongoose.connection.close();
//   })
//   .catch(err => console.error(err));
