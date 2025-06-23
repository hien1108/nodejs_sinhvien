const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
	teacherId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	major: String,
	email: String,
	phone: String,
	faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
});

module.exports = mongoose.model('Teacher', TeacherSchema);
