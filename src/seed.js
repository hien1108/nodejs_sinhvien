const mongoose = require('mongoose');
const User = require('./app/models/user');

 mongoose.connect('mongodb://localhost:27017/quan_ly_sinh_vien_dev'
// , {  useNewUrlParser: true,
//   useUnifiedTopology: true
// }
)
.then(() => {
const users = [
  { studentId: '671417', password: '123456', name: 'Nguyễn Thế Hiển' },
  { studentId: '671802', password: '234567', name: 'Tạ Hữu Quân' },
  { studentId: '671123', password: '678910', name: 'Nguyễn Văn An' },
  { studentId: '671526', password: '671526', name: 'Lê Thị Loan' },
  { studentId: '671426', password: '671426', name: 'Trần Thị Hiền' }
];
return User.insertMany(users);
})
.then(() => {
    console.log(' User data seeded successfully');
    return mongoose.connection.close();
  })
.catch((err) => {
    console.error('Error seeding User data:', err);
    mongoose.connection.close();
  })









// User.insertMany(users)
//   .then(() => {
//     console.log('Seeded data');
//     mongoose.connection.close();
//   })
//   .catch(err => console.error(err));
