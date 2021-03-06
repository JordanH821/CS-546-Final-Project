const express = require('express');
const app = express();
const staticRoutes = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const hbs = exphbs.create({});
const { validateDate } = require('./inputValidation');

hbs.handlebars.registerHelper('prettyPrintDate', function (date) {
    if (!date) return;
    if (typeof date === 'string') {
        try {
            console.log(date);
            validateDate(date);
            date = new Date(date);
        } catch (e) {
            console.log(e);
            return;
        }
    }
    let dateString = date.toISOString();
    const cutOff = dateString.indexOf('T');
    dateString = dateString.slice(0, cutOff);
    const dLst = dateString.split('-');
    return dLst[1] + '-' + dLst[2] + '-' + dLst[0];
});

// https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('formatDateValue', function (date) {
    if (!date) return;
    if (typeof date === 'string') {
        try {
            console.log(date);
            validateDate(date);
            date = new Date(date);
        } catch (e) {
            console.log(e);
            return;
        }
    }
    const dateString = date.toISOString();
    const cutOff = dateString.indexOf('T');
    return dateString.slice(0, cutOff);
});

hbs.handlebars.registerHelper('concat', function () {
    let newString = '';
    for (let i = 0; i < arguments.length - 1; i++) {
        newString += arguments[i];
    }
    return newString;
});

app.use('/public', staticRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'TaskTrackCookie',
        secret: 'Merry Christmas 123',
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
