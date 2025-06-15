const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
    score: Number
});

module.exports = mongoose.model('Grade', GradeSchema);