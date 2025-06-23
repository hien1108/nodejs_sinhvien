const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  diemQT: { type: Number, required: true },
  diemThi: { type: Number, required: true },
  diemTK: { type: Number },
  xepLoai: { type: String }
});

module.exports = mongoose.model('Grade', GradeSchema);
