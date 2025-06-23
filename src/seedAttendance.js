// ===== SEED ATTENDANCE DATA =====
// Script để tạo dữ liệu điểm danh mẫu

const mongoose = require('mongoose');
require('./src/config/db');

const Attendance = require('./src/app/models/Attendance');
const Student = require('./src/app/models/Student');
const Class = require('./src/app/models/Class');

async function seedAttendanceData() {
	try {
		console.log('🚀 Starting attendance data seeding...');

		// Xóa dữ liệu cũ
		await Attendance.deleteMany({});
		console.log('🗑️ Cleared existing attendance data');

		// Lấy danh sách lớp và sinh viên
		const classes = await Class.find().limit(3);
		const students = await Student.find().limit(10);

		if (classes.length === 0) {
			console.log('⚠️ No classes found! Please seed classes first.');
			return;
		}

		if (students.length === 0) {
			console.log('⚠️ No students found! Please seed students first.');
			return;
		}

		console.log(`📚 Found ${classes.length} classes`);
		console.log(`👥 Found ${students.length} students`);

		const attendanceData = [];
		const statuses = ['present', 'absent', 'late'];

		// Tạo dữ liệu điểm danh cho 7 ngày gần đây
		for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
			const date = new Date();
			date.setDate(date.getDate() - dayOffset);

			// Random chọn 1-2 lớp mỗi ngày
			const selectedClasses = classes.slice(
				0,
				Math.floor(Math.random() * 2) + 1
			);

			for (const classObj of selectedClasses) {
				// Random chọn 3-6 sinh viên mỗi lớp
				const numStudents = Math.floor(Math.random() * 4) + 3;
				const selectedStudents = students.slice(0, numStudents);

				for (const student of selectedStudents) {
					// Random status với tỷ lệ: 80% present, 15% late, 5% absent
					const rand = Math.random();
					let status;
					if (rand < 0.8) status = 'present';
					else if (rand < 0.95) status = 'late';
					else status = 'absent';

					const note =
						status === 'late'
							? 'Đi muộn 15 phút'
							: status === 'absent'
								? 'Vắng không phép'
								: '';

					attendanceData.push({
						date: date,
						class: classObj._id,
						student: student._id,
						status: status,
						note: note,
					});
				}
			}
		}

		// Insert dữ liệu
		const result = await Attendance.insertMany(attendanceData);
		console.log(`✅ Created ${result.length} attendance records`);

		// Hiển thị thống kê
		const stats = {
			present: await Attendance.countDocuments({ status: 'present' }),
			late: await Attendance.countDocuments({ status: 'late' }),
			absent: await Attendance.countDocuments({ status: 'absent' }),
		};

		console.log('📊 Attendance Statistics:');
		console.log(`   ✅ Present: ${stats.present}`);
		console.log(`   ⏰ Late: ${stats.late}`);
		console.log(`   ❌ Absent: ${stats.absent}`);

		console.log('🎉 Attendance data seeding completed successfully!');
	} catch (error) {
		console.error('❌ Error seeding attendance data:', error);
	} finally {
		mongoose.connection.close();
	}
}

// Chạy script
seedAttendanceData();
