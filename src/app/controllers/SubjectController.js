const Subject = require('../models/Subject');

class SubjectController {
	async index(req, res) {
		try {
			const searchTerm = req.query.search || '';
			const subjects = await Subject.find({
				$or: [
					{ maMon: { $regex: searchTerm, $options: 'i' } },
					{ tenMon: { $regex: searchTerm, $options: 'i' } },
				],
			}).sort({ maMon: 1 });

			res.render('partials/quanlymonhoc', {
				layout: 'home',
				user: req.session.user,
				subjects,
				searchTerm,
			});
		} catch (error) {
			console.error('Lỗi lấy dữ liệu môn học:', error);
			res.status(500).send('Lỗi server');
		}
	}

	async create(req, res) {
		try {
			const { maMon, tenMon, soTinChi } = req.body;

			// Validate input
			if (!maMon || !tenMon || !soTinChi) {
				return res.status(400).json({
					message:
						'Mã môn học, tên môn học và số tín chỉ không được để trống',
				});
			}

			// Validate soTinChi is a positive number
			const tinChi = parseInt(soTinChi);
			if (isNaN(tinChi) || tinChi < 1 || tinChi > 10) {
				return res.status(400).json({
					message: 'Số tín chỉ phải là số từ 1 đến 10',
				});
			}

			// Kiểm tra trùng mã môn học
			const existingSubject = await Subject.findOne({ maMon });
			if (existingSubject) {
				return res
					.status(400)
					.json({ message: 'Mã môn học đã tồn tại' });
			}

			const newSubject = new Subject({ maMon, tenMon, tinChi });
			await newSubject.save();
			res.status(200).json({ message: 'Tạo môn học thành công' });
		} catch (error) {
			console.error('Lỗi thêm môn học:', error);
			if (error.code === 11000) {
				res.status(400).json({ message: 'Mã môn học đã tồn tại' });
			} else {
				res.status(500).json({ message: 'Lỗi khi thêm môn học' });
			}
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const { maMon, tenMon, soTinChi } = req.body;

			// Validate input
			if (!maMon || !tenMon || !soTinChi) {
				return res.status(400).json({
					message:
						'Mã môn học, tên môn học và số tín chỉ không được để trống',
				});
			}

			// Validate soTinChi is a positive number
			const tinChi = parseInt(soTinChi);
			if (isNaN(tinChi) || tinChi < 1 || tinChi > 10) {
				return res.status(400).json({
					message: 'Số tín chỉ phải là số từ 1 đến 10',
				});
			}

			// Kiểm tra môn học có tồn tại không
			const subject = await Subject.findById(id);
			if (!subject) {
				return res
					.status(404)
					.json({ message: 'Không tìm thấy môn học' });
			}

			// Kiểm tra trùng mã môn học (nếu thay đổi mã môn học)
			if (subject.maMon !== maMon) {
				const existingSubject = await Subject.findOne({ maMon });
				if (existingSubject) {
					return res
						.status(400)
						.json({ message: 'Mã môn học đã tồn tại' });
				}
			}

			await Subject.findByIdAndUpdate(id, { maMon, tenMon, tinChi });
			res.status(200).json({ message: 'Cập nhật thành công' });
		} catch (error) {
			console.error('Lỗi cập nhật môn học:', error);
			res.status(500).json({ message: 'Lỗi khi cập nhật môn học' });
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.params;

			// Kiểm tra môn học có tồn tại không
			const subject = await Subject.findById(id);
			if (!subject) {
				return res
					.status(404)
					.json({ message: 'Không tìm thấy môn học' });
			}

			await Subject.findByIdAndDelete(id);
			res.status(200).json({ message: 'Xóa thành công' });
		} catch (error) {
			console.error('Lỗi xóa môn học:', error);
			res.status(500).json({ message: 'Lỗi khi xóa môn học' });
		}
	}

	async search(req, res) {
		try {
			const query = req.query.q || '';
			const subjects = await Subject.find({
				$or: [
					{ maMon: { $regex: query, $options: 'i' } },
					{ tenMon: { $regex: query, $options: 'i' } },
				],
			}).sort({ maMon: 1 });

			res.status(200).json(subjects);
		} catch (error) {
			console.error('Lỗi tìm kiếm môn học:', error);
			res.status(500).json({ message: 'Lỗi khi tìm kiếm môn học' });
		}
	}
}

module.exports = new SubjectController();
