const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

class GradeController {
	async index(req, res) {
		try {
			const searchTerm = req.query.search || '';
			let gradeQuery = {};

			if (searchTerm) {
				// Tìm kiếm theo sinh viên hoặc môn học
				const students = await Student.find({
					$or: [
						{ studentId: { $regex: searchTerm, $options: 'i' } },
						{ name: { $regex: searchTerm, $options: 'i' } },
					],
				});

				const subjects = await Subject.find({
					$or: [
						{ maMon: { $regex: searchTerm, $options: 'i' } },
						{ tenMon: { $regex: searchTerm, $options: 'i' } },
					],
				});

				const studentIds = students.map((s) => s._id);
				const subjectIds = subjects.map((s) => s._id);

				gradeQuery = {
					$or: [
						{ student: { $in: studentIds } },
						{ subject: { $in: subjectIds } },
					],
				};
			}

			const grades = await Grade.find(gradeQuery)
				.populate('student')
				.populate('subject')
				.sort({ 'student.studentId': 1 })
				.lean();

			const students = await Student.find().lean();
			const subjects = await Subject.find().lean();

			res.render('partials/quanlydiem', {
				layout: 'home',
				user: req.session.user,
				grades,
				students,
				subjects,
				searchTerm,
			});
		} catch (error) {
			console.error('Lỗi lấy dữ liệu điểm:', error);
			res.status(500).send('Lỗi server');
		}
	}

	async create(req, res) {
		try {
			const { student, subject, diemQT, diemThi } = req.body;

			// Validate input
			if (
				!student ||
				!subject ||
				diemQT === undefined ||
				diemThi === undefined
			) {
				return res.status(400).json({
					message: 'Vui lòng điền đầy đủ thông tin điểm',
				});
			}

			// Validate điểm số
			const diemQTNum = parseFloat(diemQT);
			const diemThiNum = parseFloat(diemThi);

			if (
				isNaN(diemQTNum) ||
				isNaN(diemThiNum) ||
				diemQTNum < 0 ||
				diemQTNum > 10 ||
				diemThiNum < 0 ||
				diemThiNum > 10
			) {
				return res.status(400).json({
					message: 'Điểm số phải từ 0 đến 10',
				});
			}

			// Kiểm tra trùng điểm cho sinh viên và môn học
			const existingGrade = await Grade.findOne({ student, subject });
			if (existingGrade) {
				return res.status(400).json({
					message: 'Điểm cho sinh viên và môn học này đã tồn tại',
				});
			}

			// Tính điểm tổng kết và xếp loại
			const diemTK =
				Math.round((diemQTNum * 0.3 + diemThiNum * 0.7) * 10) / 10;
			let xepLoai = '';

			if (diemTK >= 8.5) xepLoai = 'Xuất sắc';
			else if (diemTK >= 7.0) xepLoai = 'Giỏi';
			else if (diemTK >= 5.5) xepLoai = 'Khá';
			else if (diemTK >= 4.0) xepLoai = 'Trung bình';
			else xepLoai = 'Yếu';

			const newGrade = new Grade({
				student,
				subject,
				diemQT: diemQTNum,
				diemThi: diemThiNum,
				diemTK,
				xepLoai,
			});

			await newGrade.save();
			res.status(200).json({ message: 'Thêm điểm thành công' });
		} catch (error) {
			console.error('Lỗi thêm điểm:', error);
			res.status(500).json({ message: 'Lỗi khi thêm điểm' });
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const { student, subject, diemQT, diemThi } = req.body;

			// Validate input
			if (
				!student ||
				!subject ||
				diemQT === undefined ||
				diemThi === undefined
			) {
				return res.status(400).json({
					message: 'Vui lòng điền đầy đủ thông tin điểm',
				});
			}

			// Validate điểm số
			const diemQTNum = parseFloat(diemQT);
			const diemThiNum = parseFloat(diemThi);

			if (
				isNaN(diemQTNum) ||
				isNaN(diemThiNum) ||
				diemQTNum < 0 ||
				diemQTNum > 10 ||
				diemThiNum < 0 ||
				diemThiNum > 10
			) {
				return res.status(400).json({
					message: 'Điểm số phải từ 0 đến 10',
				});
			}

			// Kiểm tra điểm có tồn tại không
			const grade = await Grade.findById(id);
			if (!grade) {
				return res.status(404).json({ message: 'Không tìm thấy điểm' });
			}

			// Kiểm tra trùng điểm (nếu thay đổi sinh viên hoặc môn học)
			if (
				grade.student.toString() !== student ||
				grade.subject.toString() !== subject
			) {
				const existingGrade = await Grade.findOne({ student, subject });
				if (existingGrade) {
					return res.status(400).json({
						message: 'Điểm cho sinh viên và môn học này đã tồn tại',
					});
				}
			}

			// Tính điểm tổng kết và xếp loại
			const diemTK =
				Math.round((diemQTNum * 0.3 + diemThiNum * 0.7) * 10) / 10;
			let xepLoai = '';

			if (diemTK >= 8.5) xepLoai = 'Xuất sắc';
			else if (diemTK >= 7.0) xepLoai = 'Giỏi';
			else if (diemTK >= 5.5) xepLoai = 'Khá';
			else if (diemTK >= 4.0) xepLoai = 'Trung bình';
			else xepLoai = 'Yếu';

			await Grade.findByIdAndUpdate(id, {
				student,
				subject,
				diemQT: diemQTNum,
				diemThi: diemThiNum,
				diemTK,
				xepLoai,
			});

			res.status(200).json({ message: 'Cập nhật điểm thành công' });
		} catch (error) {
			console.error('Lỗi cập nhật điểm:', error);
			res.status(500).json({ message: 'Lỗi khi cập nhật điểm' });
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.params;

			// Kiểm tra điểm có tồn tại không
			const grade = await Grade.findById(id);
			if (!grade) {
				return res.status(404).json({ message: 'Không tìm thấy điểm' });
			}

			await Grade.findByIdAndDelete(id);
			res.status(200).json({ message: 'Xóa điểm thành công' });
		} catch (error) {
			console.error('Lỗi xóa điểm:', error);
			res.status(500).json({ message: 'Lỗi khi xóa điểm' });
		}
	}

	async search(req, res) {
		try {
			const query = req.query.q || '';

			// Tìm kiếm theo sinh viên hoặc môn học
			const students = await Student.find({
				$or: [
					{ studentId: { $regex: query, $options: 'i' } },
					{ name: { $regex: query, $options: 'i' } },
				],
			});

			const subjects = await Subject.find({
				$or: [
					{ maMon: { $regex: query, $options: 'i' } },
					{ tenMon: { $regex: query, $options: 'i' } },
				],
			});

			const studentIds = students.map((s) => s._id);
			const subjectIds = subjects.map((s) => s._id);

			const grades = await Grade.find({
				$or: [
					{ student: { $in: studentIds } },
					{ subject: { $in: subjectIds } },
				],
			})
				.populate('student')
				.populate('subject')
				.sort({ 'student.studentId': 1 });

			res.status(200).json(grades);
		} catch (error) {
			console.error('Lỗi tìm kiếm điểm:', error);
			res.status(500).json({ message: 'Lỗi khi tìm kiếm điểm' });
		}
	}
}

module.exports = new GradeController();
