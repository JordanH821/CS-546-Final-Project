const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const tasksData = require('../data/tasks');
const {
  validateStringInput,
  validatePhoneNumber,
  validateEmail
} = require('../inputValidation');

router.get(
  '/',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    try {
      //const allTasks = await tasksData.getAlltasks();
      res.render('tasks/createTask');
      //res.json(allTasks);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

router.get(
  '/:id',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    try {
      const task = await tasksData.getTaskById();
      res.json(task);
    } catch (e) {
      res.status(404).json({ error: `${e}: Task not found` });
    }
  }
);

router.post(
  '/createTask',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    //res.render('tasks/createTask', { error: e, user: req.body });
    const taskBody = req.body;
    // add validation for input data
    try {
      const {
        creatorId,
        dueDate,
        priority,
        title,
        description,
        reminderDate,
        status,
        assignee
      } = taskBody;
      const newTask = await tasksData.addTask(
        creatorId,
        dueDate,
        priority,
        title,
        description,
        reminderDate,
        status,
        assignee
      );
      res.json(newTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

router.put(
  '/:id',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    const updatedTaskData = req.body;
    // add validation for input data
    try {
      await tasksData.getTaskById(req.params.id);
    } catch (e) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    try {
      const updatedTask = await tasksData.updateTask(
        req.params.id,
        updatedTaskData
      );
      res.json(updatedTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

router.patch(
  '/:id',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    const updatedTaskData = req.body;
    //add validation for input data
    let updatedTaskObject = {};
    creatorId,
      dueDate,
      priority,
      title,
      description,
      reminderDate,
      status,
      assignee;
    try {
      const oldTask = await tasksData.getTaskById(req.params.id);
      // creatorId should not change
      if (
        updatedTaskData.dueDate &&
        updatedTaskData.dueDate !== oldTask.dueDate
      )
        updatedTaskObject.dueDate = updatedTaskData.dueDate;
      if (
        updatedTaskData.priority &&
        updatedTaskData.priority !== oldTask.priority
      )
        updatedTaskObject.priority = updatedTaskData.priority;
      if (updatedTaskData.title && updatedTaskData.title !== oldTask.title)
        updatedTaskObject.title = updatedTaskData.title;
      if (
        updatedTaskData.description &&
        updatedTaskData.description !== oldTask.description
      )
        updatedTaskObject.description = updatedTaskData.description;
      if (
        updatedTaskData.reminderDate &&
        updatedTaskData.reminderDate !== oldTask.reminderDate
      )
        updatedTaskObject.reminderDate = updatedTaskData.reminderDate;
      if (updatedTaskData.status && updatedTaskData.status !== oldTask.status)
        updatedTaskObject.status = updatedTaskData.status;
      if (
        updatedTaskData.assignee &&
        updatedTaskData.assignee !== oldTask.assignee
      )
        updatedTaskObject.assignee = updatedTaskData.assignee;

      //The following would receive input that would be added to arrays
      //Think of how best to handle these updates
      //Adding subtask
      if (
        updatedTaskData.subTask &&
        updatedTaskData.subTask !== oldTask.subTask
      )
        updatedTaskObject.subTask = updatedTaskData.subTask;
      //Adding comment
      if (
        updatedTaskData.comment &&
        updatedTaskData.comment !== oldTask.comment
      )
        updatedTaskObject.comment = updatedTaskData.comment;
      //Adding dependency
      if (
        updatedTaskData.comment &&
        updatedTaskData.comment !== oldTask.comment
      )
        updatedTaskObject.comment = updatedTaskData.comment;

      //Adding tags
      if (
        updatedTaskData.comment &&
        updatedTaskData.comment !== oldTask.comment
      )
        updatedTaskObject.comment = updatedTaskData.comment;
    } catch (e) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    try {
      const updatedTask = await tasksData.updateTask(
        req.param.id,
        updatedTaskObject
      );
      res.json(updatedTask);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

router.delete(
  '/:id',
  authenticationCheckRedirect('/users/login', true),
  async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .json({ error: 'You must supply and ID to delete a task' });
      return;
    }
    try {
      await tasksData.getTaskById(req.params.id);
    } catch (e) {
      res
        .status(404)
        .json({ error: `Task of id ${req.params.id} cannot be found` });
    }
    try {
      await tasksData.removeTask(req.params.id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

router.get('/tag/:tag', async (req, res) => {
  try {
    const taskList = await tasksData.getTasksByTag(req.params.tag);
    res.json(taskList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
