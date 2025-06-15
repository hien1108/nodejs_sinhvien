const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
    name: {
        type: String,
        required: true
      },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
});

module.exports = mongoose.model('User', UserSchema, 'users');

