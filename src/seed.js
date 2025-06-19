const mongoose = require('mongoose');
const User = require('./app/models/user');
const Student = require('./app/models/Student');
const Faculty = require('./app/models/Faculty');
const Grade = require('./app/models/Grade');
const ClassModel = require('./app/models/Class');
const Subject = require('./app/models/Subject');
const Teacher = require('./app/models/Teacher');

 mongoose.connect('mongodb://localhost:27017/quan_ly_sinh_vien_dev'
// , {  useNewUrlParser: true,
//   useUnifiedTopology: true
// }
)
.then( async () => {
  console.log('Connected MongoDB');

  // Xóa dữ liệu cũ
  await User.deleteMany({});
  await Faculty.deleteMany({});
  await ClassModel.deleteMany({});
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await Subject.deleteMany({});
  await Grade.deleteMany({});


  //Seed User
const users = [
  { studentId: '671417', password: '123456', name: 'Nguyễn Thế Hiển' },
  { studentId: '671802', password: '234567', name: 'Tạ Hữu Quân' },
  { studentId: '671123', password: '678910', name: 'Nguyễn Văn An' },
  { studentId: '671526', password: '671526', name: 'Lê Thị Loan' },
  { studentId: '671426', password: '671426', name: 'Trần Thị Hiền' }
];
await User.insertMany(users);
console.log('User data seed')

//seed Faculty
const faculties = await Faculty.insertMany([
  { maKhoa: 'CNTT', tenKhoa: 'Công nghệ thông tin'},
  { maKhoa: 'HTTT', tenKhoa: 'Hệ thống thông tin'},
  { maKhoa: 'KHMT', tenKhoa: 'Khoa học máy tính'}
]);
console.log('Faculty data seed');
console.log('Faculty:', faculties.map(f => ({ maKhoa: f.maKhoa, _id: f._id})));

//seed class
const classSeed = [
  {maLop: 'CNTTA', tenLop:'Công nghệ thông tin A', faculty: faculties[0]._id},
  {maLop: 'CNTTB', tenLop:'Công nghệ thông tin B', faculty: faculties[0]._id},
  {maLop: 'HTTTA', tenLop:'Hệ thống thông tin A', faculty: faculties[1]._id},
  {maLop: 'HTTTB', tenLop:'Hệ thống thông tin B', faculty: faculties[1]._id},
  {maLop: 'KHMTA', tenLop:'Khoa học máy tính A', faculty: faculties[2]._id},
  {maLop: 'KHMTB', tenLop:'Khoa học máy tính B', faculty: faculties[2]._id}
];
console.log("Class seed preview:", JSON.stringify(classSeed, null, 2));
const invalidClasses = classSeed.filter(c => !c.maLop);
console.log("Invalid classes:", invalidClasses);

await ClassModel.deleteMany({});
const classes = await ClassModel.insertMany(classSeed);
console.log('class data seed');



//seed Student
const students = await Student.insertMany([
  {
    studentId: '671417',
    name: 'Nguyễn Thế Hiển',
    dob: new Date('2004-08-11'),
    gender: 'Nam',
    email: '671417@sv.edu.vn',
    phone: '0388545965',
    address: 'Bắc Ninh',
    class: classes[0]._id
  },
  {
    studentId: '671802671802',
    name: 'Tạ Hữu Quân',
    dob: new Date('2004/08/26'),
    gender: 'Nam',
    email: '671802@sv.edu.vn',
    phone: '0828144526',
    address: 'Sơn La',
    class: classes[1]._id
  },
  {
    studentId: '671123',
    name: 'Nguyễn Văn An',
    dob: new Date('2004-05-16'),
    gender: 'Nam',
    email: '671123@sv.edu.vn',
    phone: '0354134255',
    address: 'Hà Nam',
    class: classes[4]._id
  },
  {
    studentId: '671526',
    name: 'Lê Thị Loan',
    dob: new Date('2004-01-25'),
    gender: 'Nữ',
    email: '671526@sv.edu.vn',
    phone: '0326416882',
    address: 'Hà Nội',
    class: classes[3]._id
  },
  {
    studentId: '671426',
    name: 'Trần Thị Hiền',
    dob: new Date('2004-11-10'),
    gender: 'Nữ',
    email: '671426@sv.edu.vn',
    phone: '0978521335',
    address: 'Hải Phòng',
    class: classes[5]._id
  }
]);
console.log('Student data seed');

//seed teacher
const teachers = await Teacher.insertMany([
  { name: 'Thầy Nguyễn Văn Hùng', major: 'CNTT'},
  { name: 'Cô Nguyễn Thùy linh', major: 'HTTT'},
  { name: 'Thầy Nguyễn Văn Bình', major: 'KHMT'},
  { name: 'Cô Nguyễn Thị Huệ', major: 'CNTT'}
]);
console.log('Teacher data seed')

//seed subject
const subjects = await Subject.insertMany([
  {maMon: 'CSDL', tenMon: 'Cơ sở dữ liệu', tinChi: 3},
  {maMon: 'LTHDT', tenMon: 'Lập trình hướng đối tượng', tinChi: 3},
  {maMon: 'TTNT', tenMon: 'Trí tuệ nhân tạo', tinChi: 3},
  {maMon: 'HQTCSDL', tenMon: 'Hệ quản trị cơ sở dữ liệu', tinChi: 3},
  {maMon: 'KTLT', tenMon: 'kỹ thuật lập trình', tinChi: 3},
  {maMon: 'THCTDL&GT', tenMon: 'Thực hành cấu trúc dữ liệu và giải thuật', tinChi: 4},
  {maMon: 'NLHDT', tenMon: 'Nguyên lý hệ điều hành', tinChi: 3},
  {maMon: 'LTJ', tenMon: 'Lập trình Java', tinChi: 3},
  {maMon: 'QTM', tenMon: 'Quản trị mạng', tinChi: 3},
  {maMon: 'LTM', tenMon: 'Lập trình mạng', tinChi: 3}
]);
console.log('Subject data seed');

//seed Grade
await Grade.insertMany([
  {
    student: students[0]._id,
    subject: subjects[0]._id,
    teacher: teachers[0]._id,
    score: 7.5
  },
  {
    student: students[1]._id,
    subject: subjects[1]._id,
    teacher: teachers[1]._id,
    score: 6.5
  },
  {
    student: students[2]._id,
    subject: subjects[3]._id,
    teacher: teachers[2]._id,
    score: 8.5
  },
  {
    student: students[3]._id,
    subject: subjects[8]._id,
    teacher: teachers[2]._id,
    score: 7.2
  },
]);
console.log('Grade data seed');



})

// .then(() => {
//     console.log(' User data seeded successfully');
//     return mongoose.connection.close();
//   })
.catch((err) => {
    console.error('Error seeding User data:', err);
  })

  .finally(() => {
    mongoose.connection.close();
  });










// User.insertMany(users)
//   .then(() => {
//     console.log('Seeded data');
//     mongoose.connection.close();
//   })
//   .catch(err => console.error(err));
