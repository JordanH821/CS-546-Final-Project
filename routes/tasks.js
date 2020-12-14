const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const tasksData = require('../data/tasks');
const userData = require('../data/users');
const { ObjectID } = require('mongodb');
const tasks = require('../data/tasks');
const users = require('../data/users');

router.get(
    '/new',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        res.render('tasks/taskView', { title: 'Create Task' });
    }
);

router.get(
    '/:id',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            const task = await tasksData.getTaskById(req.params.id);
            res.render('tasks/taskView', { title: 'Task Details', task: task });
        } catch (e) {
            res.status(404).json({ error: `${e}: Task not found` });
        }
    }
);

function convertListToArray(list) {
    let stringOfItems = String(list);
    let c = stringOfItems.split(',');
    console.log(c);
    return c;
}

router.post(
    '/new',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        // add validation for input data

        try {
            let taskBody = req.body;
            let {
                title,
                description,
                priority,
                dueDate,
                reminderDate,
                status,
                assignee,
                tags,
            } = taskBody;

            validateFullTask(taskBody);

            assignee = convertListToArray(assignee);
            tags = convertListToArray(tags);
            // console.log(assignee);
            // console.log(tags);

            let newTask = await tasksData.addTask(
                (creatorId = req.session.user._id),
                (title = title),
                (description = description),
                (priority = Number(priority)),
                (dueDate = new Date(dueDate)),
                (reminderDate = new Date(reminderDate)),
                (status = status),
                (assignee = assignee),
                (tags = tags)
            );
            let user = await userData.getUserById(newTask.creatorId);
            newTask.creatorName = `${user.firstName} ${user.lastName}`;
            console.log(newTask);

            // add task to user's tasks list
            let addingToUser = await users.addTaskToUser(
                newTask.creatorId,
                newTask._id
            );

            if (!addingToUser) {
                throw 'Unable to add task to user.';
            }

            res.redirect(`/tasks/${newTask._id}`);
        } catch (e) {
            console.log(`error ${e}`);
            res.status(500).json({ error: e });
        }
    }
);

//route validations
const validateFullTask = function (task) {
    if (!task || typeof task != 'object') {
        throw 'You must provide valid task';
    }

    if (
        !task.title ||
        typeof task.title != 'string' ||
        task.title.trim() == ''
    ) {
        throw 'You must provide a valid title3';
    }
    if (
        !task.description ||
        typeof task.description != 'string' ||
        task.description.trim() == ''
    ) {
        throw 'You must provide a valid description';
    }

    if (
        !task.assignee ||
        typeof task.assignee != 'string' ||
        task.assignee.trim() == ''
    ) {
        throw 'You must provide a valid assignee';
    }
    if (!task.tags || typeof task.tags != 'string' || task.tags.trim() == '') {
        throw 'You must provide a valid tags';
    }
};

module.exports = router;
