const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  note: { type: String }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
