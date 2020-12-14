const express = require('express');
const xss = require('xss');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const tasksData = require('../data/tasks');
const userData = require('../data/users');
const users = require('../data/users');
const {
    validateStringInput,
    validateDate,
    validateStatus,
    validatePriority,
    validateTags,
    validateObjectId,
} = require('../inputValidation');

router.get(
    '/new',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        res.render('tasks/taskView', { title: 'Create Task' });
    }
);

router.post(
    '/new',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            const rq = req.body;
            validateStringInput(xss(rq.title), 'Title');
            validateStringInput(xss(rq.description), 'Description');
            validatePriority(xss(rq.priority));
            validateDate(xss(rq.dueDate), 'Due Date');
            validateDate(xss(rq.reminderDate), 'Reminder Date');
            validateStatus(xss(rq.status));
            validateStringInput(xss(rq.assignee), 'Assignee');
            for (let i = 0; i < rq.tags.length; i++) {
                rq.tags[i] = xss(rq.tags[i]);
            };
            validateTags(rq.tags);
            const newTask = await tasksData.addTask(
                req.session.user._id,
                rq.title,
                rq.description,
                rq.priority,
                rq.dueDate,
                rq.reminderDate,
                rq.status,
                rq.assignee,
                rq.tags
            );
            await users.addTaskToUser(req.session.user._id, newTask._id);
            res.redirect(`/tasks/${newTask._id}?newTask=true`);
        } catch (e) {
            console.log(`error ${e}`);
            res.render('tasks/taskView', {
                title: 'Create Task',
                task: req.body,
                error: e,
            });
        }
    }
);

router.get(
    '/:id',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            const task = await tasksData.getTaskById(req.params.id);
            const newTask = req.query.newTask ? req.query.newTask : false;
            res.render('tasks/taskView', { title: 'Task Details', task: task, newTask: newTask});
        } catch (e) {
            res.status(404).json({ error: `${e}: Task not found` });
        }
    }
);

router.post(
    '/:id',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            const rq = req.body;
            validateObjectId(xss(req.params.id));
            validateStringInput(xss(rq.title), 'Title');
            validateStringInput(xss(rq.description), 'Description');
            validatePriority(xss(rq.priority));
            validateDate(xss(rq.dueDate), 'Due Date');
            validateDate(xss(rq.reminderDate), 'Reminder Date');
            validateStatus(xss(rq.status));
            validateStringInput(xss(rq.assignee), 'Assignee');
            for (let i = 0; i < rq.tags.length; i++) {
                rq.tags[i] = xss(rq.tags[i]);
            };
            validateTags(rq.tags);
            const newTask = await tasksData.updateTask(
                req.session.user._id,
                req.params.id,
                rq.title,
                rq.description,
                rq.priority,
                rq.dueDate,
                rq.reminderDate,
                rq.status,
                rq.assignee,
                rq.tags
            );
            res.json({ updated: true });
        } catch (e) {
            console.log(`error ${e}`);
            res.status(500).json({ updated: false, error: e });
        }
    }
);

module.exports = router;
