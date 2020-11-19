const express = require('express');
const router = express.Router();
const { createUser } = require('../data/users');

router.get('/signup', async (req, res) => {
    res.render('users/signup');
});

router.post('/signup', async (req, res) => {
    // validate input
    const result = await createUser(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        req.body.mobileNumber,
        req.body.homeNumber,
        req.body.workNumber
    );
    res.render('users/signup');
});

module.exports = router;
