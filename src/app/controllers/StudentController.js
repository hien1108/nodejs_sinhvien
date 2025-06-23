const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Class = require('../models/Class');

class StudentController {
	// Lấy danh sách sinh viên + render trang
	async index(req, res) {
		try {
			const students = await Student.find()
				.populate('maKhoa')
				.populate('class');
			const faculties = await Faculty.find();
			const classes = await Class.find();
			const formattedStudents = students.map((sv) => ({
				...sv.toObject(),
				dob: sv.dob ? sv.dob.toLocaleDateString('vi-VN') : '',
			}));

			res.render('partials/sinhvien', {
				students: formattedStudents,
				faculties,
				classes,
			});
		} catch (error) {
			console.error('❌ Lỗi khi render sinhvien:', error);
			res.status(500).send('Lỗi khi tải danh sách sinh viên');
		}
	} // Tạo sinh viên mới
	async create(req, res) {
		try {
			const {
				studentId,
				name,
				dob,
				gender,
				email,
				phone,
				address,
				maKhoa,
				class: classId,
			} = req.body;

			// Validate input
			if (!studentId || !name) {
				return res.status(400).json({
					message:
						'Mã sinh viên và tên sinh viên không được để trống',
				});
			}

			// Kiểm tra trùng mã sinh viên
			const existingStudent = await Student.findOne({ studentId });
			if (existingStudent) {
				return res
					.status(400)
					.json({ message: 'Mã sinh viên đã tồn tại' });
			}

			const newStudent = new Student({
				studentId,
				name,
				dob: dob ? new Date(dob) : null,
				gender,
				email,
				phone,
				address,
				maKhoa: maKhoa || null,
				class: classId || null,
			});

			await newStudent.save();
			res.status(200).json({ message: 'Tạo sinh viên thành công' });
		} catch (error) {
			console.error('Lỗi thêm sinh viên:', error);
			if (error.code === 11000) {
				res.status(400).json({ message: 'Mã sinh viên đã tồn tại' });
			} else {
				res.status(500).json({ message: 'Lỗi khi thêm sinh viên' });
			}
		}
	} // Cập nhật sinh viên
	async update(req, res) {
		try {
			const { id } = req.params;
			const {
				studentId,
				name,
				dob,
				gender,
				email,
				phone,
				address,
				maKhoa,
				class: classId,
			} = req.body;

			// Validate input
			if (!studentId || !name) {
				return res.status(400).json({
					message:
						'Mã sinh viên và tên sinh viên không được để trống',
				});
			}

			// Kiểm tra sinh viên có tồn tại không
			const student = await Student.findById(id);
			if (!student) {
				return res
					.status(404)
					.json({ message: 'Không tìm thấy sinh viên' });
			}

			// Kiểm tra trùng mã sinh viên (nếu thay đổi mã sinh viên)
			if (student.studentId !== studentId) {
				const existingStudent = await Student.findOne({ studentId });
				if (existingStudent) {
					return res
						.status(400)
						.json({ message: 'Mã sinh viên đã tồn tại' });
				}
			}

			const updateData = {
				studentId,
				name,
				dob: dob ? new Date(dob) : null,
				gender,
				email,
				phone,
				address,
				maKhoa: maKhoa || null,
				class: classId || null,
			};

			await Student.findByIdAndUpdate(id, updateData);
			res.status(200).json({ message: 'Cập nhật thành công' });
		} catch (error) {
			console.error('Lỗi cập nhật sinh viên:', error);
			res.status(500).json({ message: 'Lỗi khi cập nhật sinh viên' });
		}
	} // Xóa sinh viên
	async delete(req, res) {
		try {
			const { id } = req.params;

			// Kiểm tra sinh viên có tồn tại không
			const student = await Student.findById(id);
			if (!student) {
				return res
					.status(404)
					.json({ message: 'Không tìm thấy sinh viên' });
			}

			await Student.findByIdAndDelete(id);
			res.status(200).json({ message: 'Xóa thành công' });
		} catch (error) {
			console.error('Lỗi xóa sinh viên:', error);
			res.status(500).json({ message: 'Lỗi khi xóa sinh viên' });
		}
	}

	// Tìm kiếm sinh viên
	async search(req, res) {
		const query = req.query.q || '';
		try {
			const students = await Student.find({
				$or: [
					{ maSV: { $regex: query, $options: 'i' } },
					{ tenSV: { $regex: 'Nguyễn Thế Hiển', $options: 'i' } },
				],
			})
				.populate('maKhoa')
				.populate('maLop');

			res.status(200).json(students);
		} catch (error) {
			res.status(500).json({ message: 'Lỗi khi tìm kiếm', error });
		}
	}

	// Lấy danh sách sinh viên theo lớp
	async getByClass(req, res) {
		try {
			const { classId } = req.params;

			if (!classId) {
				return res.status(400).json({
					message: 'Thiếu thông tin lớp học',
				});
			}

			const students = await Student.find({ class: classId })
				.populate('maKhoa')
				.populate('class')
				.sort({ studentId: 1 });

			res.json({
				students,
				message: 'Lấy danh sách sinh viên thành công',
			});
		} catch (error) {
			console.error('❌ Lỗi khi lấy sinh viên theo lớp:', error);
			res.status(500).json({
				message: 'Lỗi server khi lấy danh sách sinh viên',
			});
		}
	}
}

module.exports = new StudentController();
