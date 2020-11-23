const express = require('express');
const router = express.Router();
const { createUser, authenticateUser } = require('../data/users');
const {
    validateStringInput,
    validatePhoneNumber,
    validateEmail,
} = require('../inputValidation');
const { authenticationCheckRedirect } = require('./middleware');

router.get(
    '/signup',
    authenticationCheckRedirect('/users/profile', false),
    async (req, res) => {
        res.render('users/signup');
    }
);

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

router.get(
    '/profile',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        res.render('users/profile', { user: req.session.user });
    }
);

router.get(
    '/login',
    authenticationCheckRedirect('/users/profile', false),
    async (req, res) => {
        res.render('users/login');
    }
);

router.post('/login', async (req, res) => {
    try {
        let email = validateEmail(req.body.email);
        validateStringInput(req.body.password);
        let user = await authenticateUser(email, req.body.password);
        req.session.user = user;
        delete req.session.user.hashedPassword;
        res.redirect('profile');
    } catch (e) {
        res.render('users/login', { error: e, user: req.body });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
