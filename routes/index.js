const userRoutes = require('./users');
const dashboardRoutes = require('./dashboard');

const constructorMethod = (app) => {
  
    // configure routes
    app.use('/users', userRoutes);
    app.use('/dashboard', dashboardRoutes);

    // wildcard route 404
    app.use('*', (req, res) => {
        res.status(404).render('error/404', { title: 'Not Found' });
    });
};

module.exports = constructorMethod;
