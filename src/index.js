const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const session = require('express-session');
// const loginRouter = require('./routes/login');
// const homeRouter = require('./routes/home');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use('/api',require('./routes/index'));
app.use(session({
    secret: 'your-secret',
    resave: 'false',
    saveUninitialized: true
}));

// Thêm vào middleware
app.use(session({
  secret: 'sinhvien_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } //tồn tại 1h
}));


//Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: false,
        layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'resources', 'views', 'partials')
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

// Sử dụng route
//app.use('/login', loginRouter);
// app.use('/', homeRouter);

 route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
