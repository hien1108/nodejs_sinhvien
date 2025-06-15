const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: String,
    major: String,
    email: String
});

module.exports = mongoose.model('Teacher', TeacherSchema);