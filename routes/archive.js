const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');

router.get(
    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        let tasks;
        let searchTerm;
        try {
            tasks = await usersData.getAllTasksForUser(req.session.user._id);
            res.render('archive/archive', {
                title: 'Archive',
                user: req.session.user,
                archiveCards: tasksData.sortTasksByDate(
                    tasks.filter((task) => task.status == 'Archived'),
                    true
                ),
                searchTerm: searchTerm,
            });
        } catch (e) {
            console.log(`Error in /archive route: ${e.toString()}`);
            res.status(500).render('error/500', {
                title: 'Server Error',
                error: 'An error occur while preparing the archive page.',
            });
        }
    }
);

module.exports = router;
