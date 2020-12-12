const userRoutes = require('./users');
const dashboardRoutes = require('./dashboard');
const archiveRoutes = require('./archive');
const { authenticationCheckRedirect } = require('./middleware');

const constructorMethod = (app) => {
    // configure routes
    app.use('/users', userRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/archive', archiveRoutes);
    app.use(
        '/',
        authenticationCheckRedirect('/dashboard', false),
        async (req, res) => {
            res.render('landing');
        }
    );
    // wildcard route 404
    app.use('*', (req, res) => {
        res.status(404).render('error/404', { title: 'Not Found' });
    });
};

module.exports = constructorMethod;
