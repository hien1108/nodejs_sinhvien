const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/quan_ly_sinh_vien_dev');

    const userSchema = new mongoose.Schema({
      studentId: Number,
      password: String,
      name: String
    });

    const User = mongoose.model('User', userSchema, 'users');

    const user = await User.findOne({ studentId: 671417 });
    if (user) {
      console.log("✅ Tìm thấy user với studentId = 671417:", user);
    } else {
      console.log("❌ Không tìm thấy user có studentId = 671417");
    }
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    mongoose.connection.close();
  }
}

run();
