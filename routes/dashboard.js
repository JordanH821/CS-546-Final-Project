const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');
const {
    validateStringInput,
    replaceQueryStringSpaces,
} = require('../inputValidation');
const { request } = require('express');

router.get(
    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        let tasks;
        let searchTerm;
        let tagSet = new Set();
        let tags;
        let tag;
        if (req.query && req.query.searchTerm) {
            searchTerm = req.query.searchTerm;
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
            tasks = await usersData.getAllTasksForUser(req.session.user._id);
        }

        tasks.map((task) => task.tags.map((t) => tagSet.add(t)));
        tags = Array.from(tagSet);

        res.render('dashboard/dashboard', {
            title: 'Dashboard',
            user: req.session.user,
            toDoCards: tasksData.sortTasksByDate(
                tasks.filter((task) => task.status == 'To Do')
            ),
            inProgressCards: tasksData.sortTasksByDate(
                tasks.filter((task) => task.status == 'In Progress')
            ),
            doneCards: tasksData.sortTasksByDate(
                tasks.filter((task) => task.status == 'Done')
            ),
            searchTerm: searchTerm,
            tag: tag,
            tags: tags,
        });
    }
);

router.post(
    '/updateTaskStatus',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        // update task with status
        const taskId = req.body.taskId;
        const updatedTask = tasksData.updateTaskStatus(taskId, req.body.status);
        if (!updatedTask) {
            // TO DO : Alert user that moving task failed
            res.status(500).redirect('/dashboard');
        }
    }
);

module.exports = router;
