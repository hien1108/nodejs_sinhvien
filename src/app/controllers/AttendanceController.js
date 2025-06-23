const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

class AttendanceController {
	async index(req, res) {
		try {
			console.log('🚀 Loading attendance page...');

			// Lấy dữ liệu cơ bản trước
			const classes = await Class.find().lean();
			const students = await Student.find().lean();

			console.log(`📚 Found ${classes.length} classes`);
			console.log(`👥 Found ${students.length} students`);

			// Lấy attendance records với try-catch riêng
			let attendanceRecords = [];
			try {
				attendanceRecords = await Attendance.find()
					.populate('student')
					.populate('class')
					.sort({ date: -1 })
					.lean();
				console.log(
					`📊 Found ${attendanceRecords.length} attendance records`
				);
			} catch (populateError) {
				console.warn(
					'⚠️ Error loading attendance records:',
					populateError.message
				);
				// Nếu populate lỗi, lấy dữ liệu thô
				attendanceRecords = await Attendance.find()
					.sort({ date: -1 })
					.lean();
				console.log(
					`� Found ${attendanceRecords.length} attendance records (without populate)`
				);
			}

			res.render('partials/diemdanh', {
				attendanceRecords,
				classes,
				students,
			});
		} catch (err) {
			console.error('❌ Error loading attendance data:', err);
			res.status(500).send('Lỗi khi tải dữ liệu điểm danh');
		}
	}
	async create(req, res) {
		try {
			console.log('🆕 Creating new attendance:', req.body);

			const {
				date,
				class: classId,
				student: studentId,
				status,
				note,
			} = req.body;

			// Validation
			if (!date || !classId || !studentId) {
				return res.status(400).json({
					message: 'Thiếu thông tin bắt buộc: ngày, lớp, sinh viên',
				});
			}

			// Kiểm tra duplicate
			const existingAttendance = await Attendance.findOne({
				date: new Date(date),
				class: classId,
				student: studentId,
			});

			if (existingAttendance) {
				return res.status(400).json({
					message: 'Sinh viên này đã được điểm danh trong ngày này',
				});
			}

			const newAttendance = await Attendance.create({
				date: new Date(date),
				class: classId,
				student: studentId,
				status: status || 'present',
				note: note || '',
			});

			console.log('✅ Attendance created:', newAttendance._id);
			res.status(200).json({
				message: 'Điểm danh thành công',
				attendance: newAttendance,
			});
		} catch (err) {
			console.error('❌ Error creating attendance:', err);
			res.status(500).json({
				message: 'Lỗi khi tạo điểm danh',
				error: err.message,
			});
		}
	}
	async update(req, res) {
		try {
			console.log('🔄 Updating attendance:', req.params.id, req.body);

			const {
				date,
				class: classId,
				student: studentId,
				status,
				note,
			} = req.body;

			// Validation
			if (!date || !classId || !studentId) {
				return res.status(400).json({
					message: 'Thiếu thông tin bắt buộc: ngày, lớp, sinh viên',
				});
			}

			const updatedAttendance = await Attendance.findByIdAndUpdate(
				req.params.id,
				{
					date: new Date(date),
					class: classId,
					student: studentId,
					status: status || 'present',
					note: note || '',
				},
				{ new: true }
			);

			if (!updatedAttendance) {
				return res.status(404).json({
					message: 'Không tìm thấy bản ghi điểm danh',
				});
			}

			console.log('✅ Attendance updated:', updatedAttendance._id);
			res.status(200).json({
				message: 'Cập nhật điểm danh thành công',
				attendance: updatedAttendance,
			});
		} catch (err) {
			console.error('❌ Error updating attendance:', err);
			res.status(500).json({
				message: 'Lỗi khi cập nhật điểm danh',
				error: err.message,
			});
		}
	}
	async delete(req, res) {
		try {
			console.log('🗑️ Deleting attendance:', req.params.id);

			const deletedAttendance = await Attendance.findByIdAndDelete(
				req.params.id
			);

			if (!deletedAttendance) {
				return res.status(404).json({
					message: 'Không tìm thấy bản ghi điểm danh',
				});
			}

			console.log('✅ Attendance deleted:', deletedAttendance._id);
			res.status(200).json({
				message: 'Xóa điểm danh thành công',
			});
		} catch (err) {
			console.error('❌ Error deleting attendance:', err);
			res.status(500).json({
				message: 'Lỗi khi xóa điểm danh',
				error: err.message,
			});
		}
	}

	async filter(req, res) {
		const { date, classId } = req.query;
		const query = {};
		if (date) query.date = new Date(date);
		if (classId) query.class = classId;

		try {
			const attendances = await Attendance.find(query)
				.populate('student')
				.populate('class')
				.lean();
			res.status(200).json(attendances);
		} catch (err) {
			res.status(500).json({ message: 'Lỗi lọc điểm danh', err });
		}
	}
}

module.exports = new AttendanceController();
