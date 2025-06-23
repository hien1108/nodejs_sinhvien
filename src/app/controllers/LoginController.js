const User = require('../models/user');

const LoginController = {
	handleLogin: async (req, res) => {
		console.log('Method:', req.method);
		console.log('URL:', req.url);
		console.log('Body:', req.body);
		console.log('Headers:', req.headers);

		// Kiểm tra dữ liệu đầu vào
		if (!req.body || !req.body.teacherId || !req.body.password) {
			console.warn(
				'Received invalid request with empty body or missing params'
			);
			return res.status(400).send('Thiếu thông tin đăng nhập');
		}

		// Ép kiểu teacherId sang string để khớp với dữ liệu trong MongoDB
		const teacherId = String(req.body.teacherId).trim();
		const password = req.body.password;

		try {
			console.log('📩 Từ form:', teacherId, password);

			console.log('🔍 Tìm kiếm user với teacherId =', teacherId);

			// Tìm user theo teacherId (kiểu string)
			const user = await User.findOne({ teacherId }).populate('teacher');

			console.log('👤 User tìm được:', user);

			if (!user || user.password !== password) {
				return res.render('login', {
					error: 'Mã giáo viên hoặc mật khẩu không đúng.',
				});
			}

			// Lưu thông tin người dùng vào session
			req.session.user = {
				id: user._id,
				teacherId: user.teacherId,
				name: user.name,
				role: user.role,
			};

			console.log('✅ Đăng nhập thành công:', user);
			res.redirect('/home');
		} catch (error) {
			console.error('❌ Lỗi đăng nhập:', error);
			res.status(500).send('Lỗi máy chủ');
		}
	},
};

module.exports = LoginController;
