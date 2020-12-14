const express = require('express');
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
  validateObjectId
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
      validateStringInput(rq.title, 'Title');
      validateStringInput(rq.description, 'Description');
      validatePriority(rq.priority);
      validateDate(rq.dueDate, 'Due Date');
      validateDate(rq.reminderDate, 'Reminder Date');
      validateStatus(rq.status);
      validateStringInput(rq.assignee, 'Assignee');
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
      res.redirect(`/tasks/${newTask._id}`);
    } catch (e) {
      console.log(`error ${e}`);
      res.render('tasks/taskView', {
        title: 'Create Task',
        task: req.body,
        error: e
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
      res.render('tasks/taskView', { title: 'Task Details', task: task });
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
      validateObjectId(req.params.id);
      validateStringInput(rq.title, 'Title');
      validateStringInput(rq.description, 'Description');
      validatePriority(rq.priority);
      validateDate(rq.dueDate, 'Due Date');
      validateDate(rq.reminderDate, 'Reminder Date');
      validateStatus(rq.status);
      validateStringInput(rq.assignee, 'Assignee');
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
