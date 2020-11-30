const express = require('express');
const app = express();
const staticRoutes = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

const seed = require('./tasks/seed/seed');

app.use('/public', staticRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'TaskTrackCookie',
        secret: 'some secret string!', // TODO change to random
        resave: false,
        saveUninitialized: true,
    })
);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
