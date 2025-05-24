const loginRouter = require('./login');
const homeRouter = require('./home');
function route(app) {
    app.use('/login', loginRouter);

    app.use('/home', homeRouter);
}

module.exports = route;
