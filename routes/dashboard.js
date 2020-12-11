const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');
const { updateTask, getTaskNotificationsForUser } = require('../data/tasks');
const users = require('../data/users');
const {
    validateStringInput,
    replaceQueryStringSpaces,
} = require('../inputValidation');

router.get(
    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        let tasks;
        let searchTerm;
        if (req.query && req.query.searchTerm) {
            searchTerm = req.query.searchTerm;
            try {
                searchTerm = validateStringInput(searchTerm);
                tasks = await usersData.searchUsersTasks(
                    req.session.user._id,
                    searchTerm
                );
                tasks = await tasks.toArray();
            } catch (e) {
                console.log(`Error searching tasks: ${e}`);
                tasks = await usersData.getAllTasksForUser(
                    req.session.user._id
                );
            }
        } else {
            tasks = await usersData.getAllTasksForUser(req.session.user._id);
        }

        let taskNotifications = await getTaskNotificationsForUser(
            req.session.user._id
        );
        taskNotifications = await taskNotifications.toArray();
        console.log(taskNotifications);

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
            taskNotifications: taskNotifications,
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
