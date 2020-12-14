const express = require('express');
var xss = require("xss");
const router = express.Router();
const { createUser, authenticateUser, updateUser } = require('../data/users');
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
        const firstName = validateStringInput(xss(rq.firstName), 'First Name');
        const lastName = validateStringInput(xss(rq.lastName), 'Last Name');
        const email = validateEmail(xss(rq.email));
        validateStringInput(xss(rq.password), 'Password'); // don't set password equal to the return so that the user can have whitespace in their password
        validatePhoneNumber(xss(rq.mobileNumber), 'Mobile');
        validatePhoneNumber(xss(rq.homeNumber), 'Home');
        validatePhoneNumber(xss(rq.workNumber), 'Work');
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
        res.redirect('/dashboard');
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

router.post(
    '/profile/update',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        const rq = req.body;
        try {
            const firstName = validateStringInput(xss(rq.firstName), 'First Name');
            const lastName = validateStringInput(xss(rq.lastName), 'Last Name');
            validatePhoneNumber(xss(rq.mobileNumber), 'Mobile');
            validatePhoneNumber(xss(rq.homeNumber), 'Home');
            validatePhoneNumber(xss(rq.workNumber), 'Work');
            const updatedUser = await updateUser(
                req.session.user._id,
                firstName,
                lastName,
                rq.mobileNumber,
                rq.homeNumber,
                rq.workNumber
            );
            // update session
            req.session.user = updatedUser;
            delete req.session.user.hashedPassword; // remove hashedPassword for security
            delete req.session.user.tasks; // delete tasks so they are not passed around unnecessarily
            res.json({ updated: true });
        } catch (e) {
            console.log(e);
            res.status(500).json({ updated: false, error: e });
        }
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
        let email = validateEmail(xss(req.body.email));
        validateStringInput(xss(req.body.password));
        let user = await authenticateUser(email, xss(req.body.password));
        req.session.user = user;
        delete req.session.user.hashedPassword;
        res.redirect('/dashboard');
    } catch (e) {
        res.render('users/login', { error: e, user: req.body });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
