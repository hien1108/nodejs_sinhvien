const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const session = require('express-session');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// const route = require('./routes');
const db = require('./config/db');

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());
const route = require('./routes');
app.use(
	session({
		secret: 'your-secret',
		resave: 'false',
		saveUninitialized: true,
	})
);

// Thêm vào middleware
app.use(
	session({
		secret: 'sinhvien_secret_key',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 60 * 1000 }, //tồn tại 1h
	})
);

//Template engine
app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: false,
		handlebars: allowInsecurePrototypeAccess(Handlebars),
		helpers: {
			inc: (value) => parseInt(value) + 1,
			eq: (a, b) => a === b, // Helper so sánh bằng
			formatDate: (date) => {
				if (!date) return '';
				const d = new Date(date);
				return `${d.getDate().toString().padStart(2, '0')}/${(
					d.getMonth() + 1
				)
					.toString()
					.padStart(2, '0')}/${d.getFullYear()}`;
			},
			translateStatus: (status) => {
				switch (status) {
					case 'present':
						return 'Có mặt';
					case 'absent':
						return 'Vắng';
					case 'late':
						return 'Đi muộn';
					default:
						return status;
				}
			},
			calculateTK: (diemQT, diemThi) => {
				if (isNaN(diemQT) || isNaN(diemThi)) return '';
				return (
					(parseFloat(diemQT) + parseFloat(diemThi) * 2) /
					3
				).toFixed(2);
			},
			calculateLoai: (diemQT, diemThi) => {
				const tk = (parseFloat(diemQT) + parseFloat(diemThi) * 2) / 3;
				if (tk >= 8.5) return 'Giỏi';
				if (tk >= 7) return 'Khá';
				if (tk >= 5.5) return 'TB';
				if (tk >= 4) return 'Yếu';
				return 'Kém';
			},
		},
		layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
		partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
	})
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Sử dụng route
//app.use('/login', loginRouter);
// app.use('/', homeRouter);

// Test route for debugging
app.get('/test_functions.html', (req, res) => {
	res.sendFile(path.join(__dirname, '../test_functions.html'));
});

route(app);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
