const mongoose = require('mongoose');


const FacultySchema = new mongoose.Schema({
    maKhoa: { type: String, required: true, unique: true},
    tenKhoa: { type: String, required: true}
});

module.exports = mongoose.model('Faculty', FacultySchema);