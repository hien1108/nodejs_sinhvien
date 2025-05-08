const loginRouter = require('./login');
const siteRouter = require('./site');
function route(app) {
    app.use('/login', loginRouter);

    app.use('/', siteRouter);
}

module.exports = route;
