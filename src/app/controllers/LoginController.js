const User = require('../models/user');

const LoginController = {
  handleLogin: async (req, res) => {
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    if (!req.body || !req.body.studentId || !req.body.password) {
      console.warn('Received invalid request with empty body or missing params');
      return res.status(400).send('Thiếu thông tin đăng nhập');
    }

    const studentId = parseInt(req.body.studentId, 10);
    const password = req.body.password;

    if (isNaN(studentId)) {
      return res.status(400).send('Mã sinh viên không hợp lệ');
    }

    try {
      console.log("Tìm kiếm user với studentId =", studentId);
      const user = await User.findOne({ studentId });
      console.log("User tìm được:", user);

      if (!user || user.password !== password) {
        return res.render('login', { error: 'Mã sinh viên hoặc mật khẩu không đúng.' });
      }

      req.session.user = {
        id: user._id,
        studentId: user.studentId,
        name: user.name
      };

      console.log('Đăng nhập thành công:', user);
      res.redirect('/home');
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi máy chủ');
    }
  },
};

module.exports = LoginController;





// class LoginController {
//     index(req, res) {
//         res.render('login');
//       }
//       async handleLogin(req, res) {
//         const { studentId, password } = req.body;
    
//         try {
//           const user = await Student.findOne({ studentId });
    
//           if (!user || user.password !== password) {
//             return res.render('login', { error: 'Sai mã sinh viên hoặc mật khẩu' });
//           }
    
//           // Đăng nhập thành công
//           res.redirect('/home'); // hoặc lưu session
//         } catch (error) {
//           res.status(500).send("Lỗi máy chủ");
//         }
//       }
// }
    



//     GET /news
//     index(req, res) {
//         res.render('login');
//     }
// }

    // //GET /news/:slug
    //  show(req, res) {
    //      res.send('new detail!!!');
    //  }



