const mongoose = require('mongoose');
const User = require('./app/models/user'); 

async function fixStudentIdType() {
  try {
    await mongoose.connect('mongodb://localhost:27017/quan_ly_sinh_vien_dev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const users = await User.find({});
    for (const user of users) {
      if (typeof user.studentId === 'string') {
        const newStudentId = parseInt(user.studentId, 10);
        if (!isNaN(newStudentId)) {
          await User.updateOne({ _id: user._id }, { studentId: newStudentId });
          console.log(`Đã chuyển studentId user ${user._id} từ string sang number:`, newStudentId);
        } else {
          console.warn(`Không thể chuyển studentId của user ${user._id} vì không phải số:`, user.studentId);
        }
      }
    }

    console.log('Hoàn tất chuyển đổi studentId sang kiểu Number');
  } catch (error) {
    console.error('Lỗi khi kết nối hoặc cập nhật:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixStudentIdType();
