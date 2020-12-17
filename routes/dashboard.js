const express = require('express');
const xss = require('xss');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');
const { getTaskNotificationsForUser } = require('../data/tasks');
const {
    validateStringInput,
    replaceQueryStringSpaces,
} = require('../inputValidation');
const { request } = require('express');

router.get(
    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            let tasks;
            let searchTerm;
            let tagSet = new Set();
            let tags;
            let tag;
            if (req.query && req.query.searchTerm) {
                searchTerm = xss(req.query.searchTerm);
                try {
                    searchTerm = validateStringInput(searchTerm);
                    tasks = await usersData.searchUsersTasks(
                        req.session.user._id,
                        searchTerm
                    );
                } catch (e) {
                    console.log(`Error searching tasks: ${e}`);
                    tasks = await usersData.getAllTasksForUser(
                        req.session.user._id
                    );
                }
            } else if (req.query && req.query.tag) {
                tag = validateStringInput(req.query.tag);
                tasks = await usersData.getUsersTasksByTag(
                    req.session.user._id,
                    tag
                );
            } else {
                tasks = await usersData.getAllTasksForUser(
                    req.session.user._id
                );
            }

            tasks
                .filter((task) => task.status != 'Archived')
                .map((task) => task.tags.map((t) => tagSet.add(t)));
            tags = Array.from(tagSet);

            let taskNotifications = await getTaskNotificationsForUser(
                req.session.user._id
            );
            res.render('dashboard/dashboard', {
                title: 'Dashboard',
                user: req.session.user,
                toDoCards: tasksData.sortTasksByDate(
                    tasks.filter((task) => task.status == 'To Do'),
                    false
                ),
                inProgressCards: tasksData.sortTasksByDate(
                    tasks.filter((task) => task.status == 'In Progress'),
                    false
                ),
                doneCards: tasksData.sortTasksByDate(
                    tasks.filter((task) => task.status == 'Done'),
                    false
                ),
                searchTerm: searchTerm,
                tag: tag,
                tags: tags,
                taskNotifications: taskNotifications,
            });
        } catch (e) {
            console.log(`Error in /dashboard route: ${e.toString()}`);
            res.status(500).render('error/500', {
                title: 'Server Error',
                error: 'An error occur while preparing the dashboard page.',
            });
        }
    }
);

router.post(
    '/updateTaskStatus',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            // update task with status
            const taskId = req.body.taskId;
            const updatedTask = await tasksData.updateTaskStatus(
                taskId,
                req.body.status
            );
            if (!updatedTask) {
                res.status(500).redirect('/dashboard');
            }
        } catch (e) {
            console.log(
                `Error in /dashboard/updateTaskStatus route: ${e.toString()}`
            );
            res.status(500).redirect('/dashboard');
        }
    }
);

module.exports = router;
