const Faculty = require('../models/Faculty');

class FacultyController {
	async index(req, res) {
		try {
			const searchTerm = req.query.search || '';
			const faculties = await Faculty.find({
				$or: [
					{ maKhoa: { $regex: searchTerm, $options: 'i' } },
					{ tenKhoa: { $regex: searchTerm, $options: 'i' } },
				],
			}).sort({ maKhoa: 1 });

			res.render('partials/khoa', {
				layout: 'home',
				user: req.session.user,
				faculties,
				searchTerm,
			});
		} catch (error) {
			console.error('Lỗi lấy dữ liệu khoa:', error);
			res.status(500).send('Lỗi server');
		}
	}
	async create(req, res) {
		try {
			const { maKhoa, tenKhoa } = req.body;

			// Validate input
			if (!maKhoa || !tenKhoa) {
				return res
					.status(400)
					.json({
						message: 'Mã khoa và tên khoa không được để trống',
					});
			}

			// Kiểm tra trùng mã khoa
			const existingFaculty = await Faculty.findOne({ maKhoa });
			if (existingFaculty) {
				return res.status(400).json({ message: 'Mã khoa đã tồn tại' });
			}

			const newFaculty = new Faculty({ maKhoa, tenKhoa });
			await newFaculty.save();
			res.status(200).json({ message: 'Tạo khoa thành công' });
		} catch (error) {
			console.error('Lỗi thêm khoa:', error);
			if (error.code === 11000) {
				res.status(400).json({ message: 'Mã khoa đã tồn tại' });
			} else {
				res.status(500).json({ message: 'Lỗi khi thêm khoa' });
			}
		}
	}
	async update(req, res) {
		try {
			const { id } = req.params;
			const { maKhoa, tenKhoa } = req.body;

			// Validate input
			if (!maKhoa || !tenKhoa) {
				return res
					.status(400)
					.json({
						message: 'Mã khoa và tên khoa không được để trống',
					});
			}

			// Kiểm tra khoa có tồn tại không
			const faculty = await Faculty.findById(id);
			if (!faculty) {
				return res.status(404).json({ message: 'Không tìm thấy khoa' });
			}

			// Kiểm tra trùng mã khoa (nếu thay đổi mã khoa)
			if (faculty.maKhoa !== maKhoa) {
				const existingFaculty = await Faculty.findOne({ maKhoa });
				if (existingFaculty) {
					return res
						.status(400)
						.json({ message: 'Mã khoa đã tồn tại' });
				}
			}

			await Faculty.findByIdAndUpdate(id, { maKhoa, tenKhoa });
			res.status(200).json({ message: 'Cập nhật thành công' });
		} catch (error) {
			console.error('Lỗi cập nhật khoa:', error);
			res.status(500).json({ message: 'Lỗi khi cập nhật khoa' });
		}
	}
	async delete(req, res) {
		try {
			const { id } = req.params;

			// Kiểm tra khoa có tồn tại không
			const faculty = await Faculty.findById(id);
			if (!faculty) {
				return res.status(404).json({ message: 'Không tìm thấy khoa' });
			}

			await Faculty.findByIdAndDelete(id);
			res.status(200).json({ message: 'Xóa thành công' });
		} catch (error) {
			console.error('Lỗi xóa khoa:', error);
			res.status(500).json({ message: 'Lỗi khi xóa khoa' });
		}
	}
}

module.exports = new FacultyController();
