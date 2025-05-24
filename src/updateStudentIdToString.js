const mongoose = require('mongoose');
const User = require('../src/app/models/user'); // Đường dẫn đến file model User 

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/web_quan_ly_sinh_vien_dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('Đã kết nối MongoDB');

  try {
    const users = await User.find({});
    for (const user of users) {
      if (typeof user.studentId === 'number') {
        user.studentId = user.studentId.toString();
        await user.save();
        console.log(`✔ Đã cập nhật studentId cho user _id=${user._id}`);
      }
    }
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật:', error);
  } finally {
    mongoose.connection.close();
  }
});
