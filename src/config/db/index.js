const mongoose = require('mongoose');

function connect() {
  return mongoose.connect('mongodb://localhost:27017/web_quan_ly_sinh_vien_dev')
    .then(() => {
      console.log('Connected to MongoDB');
      console.log('📌 Using database:', mongoose.connection.name);
    })
    .catch((err) => {
      console.log('Failed to connect to MongoDB', err);
    });
}

module.exports = { connect };
