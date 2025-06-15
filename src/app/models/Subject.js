const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    maMon: { type: String, required: true, unique: true},
    tenMon: { type: String, required: true},
    tinChi: Number
});

module.exports = mongoose.model('Subject', SubjectSchema);