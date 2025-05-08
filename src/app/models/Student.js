const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    name:{type: String, maxlength: 255},
    age: {type: Number, min: 18, index: true},
    studentId: {type: String, maxlength: 255},
    class: {type: String, maxlength: 255},
    email: {type: String, maxlength: 600},
    date: {type: Date, default: Date.now}
  });

  module.exports = mongoose.model('Student', Student);