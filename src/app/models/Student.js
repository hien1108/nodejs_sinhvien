const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true},
  name: { type: String, required: true},
  dob: Date,
  gender: String,
  email: String,
  phone: String,
  address: String,
  maKhoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  class: { type: mongoose.Schema.Types.ObjectId, ref:'Class'}
});

  module.exports = mongoose.model('Student', StudentSchema);