const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	teacherId: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['teacher', 'admin'],
		default: 'teacher',
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teacher',
	},
});

module.exports = mongoose.model('User', UserSchema, 'users');
