const ClassModel = require('../models/Class');

class ClassController {
	async index(req, res) {
		try {
			const searchTerm = req.query.search || '';
			const classes = await ClassModel.find({
				$or: [
					{ maLop: { $regex: searchTerm, $options: 'i' } },
					{ tenLop: { $regex: searchTerm, $options: 'i' } },
				],
			}).sort({ maLop: 1 });

			res.render('partials/lop', {
				layout: 'home',
				user: req.session.user,
				classes,
				searchTerm,
			});
		} catch (err) {
			console.error('Lỗi lấy danh sách lớp:', err);
			res.status(500).send('Lỗi server');
		}
	}
	async create(req, res) {
		try {
			const { maLop, tenLop } = req.body;

			// Validate input
			if (!maLop || !tenLop) {
				return res.status(400).json({
					message: 'Mã lớp và tên lớp không được để trống',
				});
			}

			// Kiểm tra trùng mã lớp
			const existingClass = await ClassModel.findOne({ maLop });
			if (existingClass) {
				return res.status(400).json({ message: 'Mã lớp đã tồn tại' });
			}

			const newClass = new ClassModel({ maLop, tenLop });
			await newClass.save();
			res.status(200).json({ message: 'Tạo lớp thành công' });
		} catch (error) {
			console.error('Lỗi thêm lớp:', error);
			if (error.code === 11000) {
				res.status(400).json({ message: 'Mã lớp đã tồn tại' });
			} else {
				res.status(500).json({ message: 'Lỗi khi thêm lớp' });
			}
		}
	}
	async update(req, res) {
		try {
			const { id } = req.params;
			const { maLop, tenLop } = req.body;

			// Validate input
			if (!maLop || !tenLop) {
				return res.status(400).json({
					message: 'Mã lớp và tên lớp không được để trống',
				});
			}

			// Kiểm tra lớp có tồn tại không
			const classItem = await ClassModel.findById(id);
			if (!classItem) {
				return res.status(404).json({ message: 'Không tìm thấy lớp' });
			}

			// Kiểm tra trùng mã lớp (nếu thay đổi mã lớp)
			if (classItem.maLop !== maLop) {
				const existingClass = await ClassModel.findOne({ maLop });
				if (existingClass) {
					return res
						.status(400)
						.json({ message: 'Mã lớp đã tồn tại' });
				}
			}

			await ClassModel.findByIdAndUpdate(id, { maLop, tenLop });
			res.status(200).json({ message: 'Cập nhật thành công' });
		} catch (error) {
			console.error('Lỗi cập nhật lớp:', error);
			res.status(500).json({ message: 'Lỗi khi cập nhật lớp' });
		}
	}
	async delete(req, res) {
		try {
			const { id } = req.params;

			// Kiểm tra lớp có tồn tại không
			const classItem = await ClassModel.findById(id);
			if (!classItem) {
				return res.status(404).json({ message: 'Không tìm thấy lớp' });
			}

			await ClassModel.findByIdAndDelete(id);
			res.status(200).json({ message: 'Xóa thành công' });
		} catch (error) {
			console.error('Lỗi xóa lớp:', error);
			res.status(500).json({ message: 'Lỗi khi xóa lớp' });
		}
	}
}

module.exports = new ClassController();
