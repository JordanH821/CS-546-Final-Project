// TODO
const constructorMethod = (app) => {
    app.use('*', (req, res) => {
        res.status(404).render('error/404', { title: 'Not Found' });
    });
};

module.exports = constructorMethod;
