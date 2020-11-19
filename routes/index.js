const userRoutes = require('./users');
const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('*', (req, res) => {
        res.status(404).render('error/404', { title: 'Not Found' });
    });
};

module.exports = constructorMethod;
