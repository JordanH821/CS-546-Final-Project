const express = require('express');
const router = express.Router();
const { createUser } = require('../data/users');
const {
    validateStringInput,
    validatePhoneNumber,
    validateEmail,
} = require('../inputValidation');

router.get('/signup', async (req, res) => {
    res.render('users/signup');
});

router.post('/signup', async (req, res) => {
    try {
        // validate input
        const rq = req.body;
        const firstName = validateStringInput(rq.firstName, 'First Name');
        const lastName = validateStringInput(rq.lastName, 'Last Name');
        const email = validateEmail(rq.email);
        validateStringInput(rq.password, 'Password'); // don't set password equal to the return so that the user can have whitespace in their password
        validatePhoneNumber(rq.mobileNumber, 'Mobile');
        validatePhoneNumber(rq.homeNumber, 'Home');
        validatePhoneNumber(rq.workNumber, 'Work');
        const newUser = await createUser(
            firstName,
            lastName,
            email,
            rq.password,
            rq.mobileNumber,
            rq.homeNumber,
            rq.workNumber
        );
        req.session.user = newUser;
        delete req.session.user.hashedPassword; // remove hashedPassword for security
        delete req.session.user.tasks; // delete tasks so they are not passed around unnecessarily
        res.redirect('/users/profile');
    } catch (e) {
        res.render('users/signup', { user: req.body, error: e });
    }
});

router.get('/profile', async (req, res) => {
    res.render('users/profile', { user: req.session.user });
});

router.get('/login', async (req, res) => {
    res.render('users/login');
});

router.post('/login', async (req, res) => {
    console.log(req.body);
    res.send('login');
});

module.exports = router;
