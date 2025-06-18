const mongoose = require('mongoose');
const Faculty = require('./Faculty');

const ClassSchema = new mongoose.Schema({
    maLop: {type: String, required: true, unique: true},
    tenLop: { type: String, required: true},
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true}
});

module.exports = mongoose.model('Class', ClassSchema);