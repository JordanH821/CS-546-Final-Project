const express = require('express');
const xss = require('xss');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const tasksData = require('../data/tasks');
const users = require('../data/users');
const commentsData = require('../data/comments');

const {
    validateStringInput,
    validateDate,
    validateStatus,
    validatePriority,
    validateTags,
    validateObjectId,
    validateSubtasks,
    validateDependencies,
    validateDueDate,
    validateReminderDate,
} = require('../inputValidation');

router.get(
    '/new',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        const tasks = await users.getActiveTasksForUser(req.session.user._id);
        res.render('tasks/taskView', { title: 'Create Task', allTasks: tasks });
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
            validateDueDate(xss(rq.dueDate));
            validateDate(xss(rq.reminderDate), 'Reminder Date');
            validateDueDate(xss(rq.reminderDate), xss(rq.dueDate));
            validateStatus(xss(rq.status));
            validateStringInput(xss(rq.assignee), 'Assignee');
            validateTags(rq.tags);
            rq.subtasks = validateSubtasks(rq.subtasks);
            if (xss(rq.dependencies) === '') {
                rq.dependencies = validateDependencies(xss(rq.dependencies));
            } else {
                for (let i = 0; i < rq.dependencies.length; i++) {
                    rq.dependencies[i] = xss(rq.dependencies[i]);
                }
            }
            for (let i = 0; i < rq.subtasks.length; i++) {
                rq.subtasks[i] = xss(rq.subtasks[i]);
            }
            for (let i = 0; i < rq.subtasks.length; i++) {
                rq.subtasks[i] = xss(rq.subtasks[i]);
            }
            const newTask = await tasksData.addTask(
                xss(req.session.user._id),
                xss(rq.title),
                xss(rq.description),
                xss(rq.priority),
                xss(rq.dueDate),
                xss(rq.reminderDate),
                xss(rq.status),
                xss(rq.assignee),
                rq.tags,
                rq.subtasks,
                rq.dependencies
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

router.post(
    '/comment',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            const comment = xss(req.body.comment);
            const taskId = xss(req.body.taskId);

            validateStringInput(xss(comment));

            // check if task belongs to logged in user
            const tasksForUser = await users.getAllTasksForUser(
                xss(req.session.user._id)
            );
            const task = tasksForUser.find((t) => t._id.toString() === taskId);

            if (!task) {
                throw 'Invalid Task Id';
            }

            // create comment
            const newComment = await commentsData.addComment(
                req.session.user._id.toString(),
                new Date().toString(),
                taskId,
                comment
            );

            // add comment to task
            await tasksData.addCommentToTask(task._id, newComment._id);

            res.json({ comment: newComment });
        } catch (e) {
            res.status(400).json({ error: 'Comment failed to add' });
        }
    }
);

router.get(
    '/:id',
    authenticationCheckRedirect('/users/login', true),
    async (req, res) => {
        try {
            // check if task belongs to logged in user
            const tasksForUser = await users.getAllTasksForUser(
                xss(req.session.user._id)
            );
            const task = tasksForUser.find(
                (t) => t._id.toString() === xss(req.params.id)
            );
            if (!task) {
                throw 'Invalid Task Id';
            }

            // if task is found, render details
            const newTask = req.query.newTask ? req.query.newTask : false;

            let tasks = await users.getActiveNonDependenciesForUser(
                req.session.user._id,
                task.dependencies,
                task._id
            );
            tasks = tasks.filter(
                (t) => t._id.toString() !== task._id.toString()
            );

            const dependencies = await tasksData.getTasksInList(
                task.dependencies
            );

            const commentList = await commentsData.getAllCommentsForTask(
                task._id.toString()
            );

            res.render('tasks/taskView', {
                title: 'Task Details',
                task: task,
                newTask: newTask,
                allTasks: tasks,
                dependencies: dependencies,
                comments: commentList,
            });
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
            validateDueDate(xss(rq.dueDate));
            validateDate(xss(rq.reminderDate), 'Reminder Date');
            validateDueDate(xss(rq.reminderDate), xss(rq.dueDate));
            validateStatus(xss(rq.status));
            validateStringInput(xss(rq.assignee), 'Assignee');
            rq.subtasks = validateSubtasks(rq.subtasks);
            if (xss(rq.dependencies) === '') {
                rq.dependencies = validateDependencies(xss(rq.dependencies));
            } else {
                for (let i = 0; i < rq.dependencies.length; i++) {
                    rq.dependencies[i] = xss(rq.dependencies[i]);
                }
            }
            for (let i = 0; i < rq.tags.length; i++) {
                rq.tags[i] = xss(rq.tags[i]);
            }
            for (let i = 0; i < rq.subtasks.length; i++) {
                rq.subtasks[i] = xss(rq.subtasks[i]);
            }
            validateTags(rq.tags);
            validateSubtasks(rq.subtasks);
            const newTask = await tasksData.updateTask(
                xss(req.session.user._id),
                xss(req.params.id),
                xss(rq.title),
                xss(rq.description),
                xss(rq.priority),
                xss(rq.dueDate),
                xss(rq.reminderDate),
                xss(rq.status),
                xss(rq.assignee),
                xss(rq.tags),
                rq.subtasks,
                rq.dependencies
            );
            res.json({ updated: true });
        } catch (e) {
            console.log(`error ${e}`);
            res.status(500).render('500');
        }
    }
);

module.exports = router;
