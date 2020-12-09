const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const usersData = require('../data/users');
const tasksData = require('../data/tasks');
const { updateTask } = require('../data/tasks');

router.get(
    '/',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        const tasks = await usersData.getAllTasksForUser(req.session.user._id);

        res.render('dashboard/dashboard', {
            title: 'Dashboard',
            user: req.session.user,
            toDoCards: tasksData.sortTasksByDate(tasks.filter(task => task.status == 'To Do')),
            inProgressCards: tasksData.sortTasksByDate(tasks.filter(task => task.status == 'In Progress')),
            doneCards: tasksData.sortTasksByDate(tasks.filter(task => task.status == 'Done'))
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
