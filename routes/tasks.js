const express = require('express');
const router = express.Router();
const { authenticationCheckRedirect } = require('./middleware');
const tasksData = require('../data/tasks');
const userData = require('../data/users');
const { ObjectID } = require('mongodb');
const tasks = require('../data/tasks');
const users = require('../data/users');

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
      const task = await tasksData.getTaskById(req.params.id);
      res.json(task);
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
  '/createTask',
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
        tags
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
      let addingToUser = await users.addTaskToUser(newTask.creatorId,newTask._id);

      if (!addingToUser) {
        throw 'Unable to add task to user.';
      }

      // if the asignee is an email address, add the task to the assignee also
      


      res.render('tasks/viewSingleTask', { task: newTask });
    } catch (e) {
      console.log(`error ${e}`);
      //res.status(500).json({ error: e });
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

//route validations
const validateFullTask = function(task) {
  if (!task || typeof task != 'object') {
    throw 'You must provide valid task';
  }

  if (!task.title || typeof task.title != 'string' || task.title.trim() == '') {
    throw 'You must provide a valid title3';
  }
  if (
    !task.description ||
    typeof task.description != 'string' ||
    task.description.trim() == ''
  ) {
    throw 'You must provide a valid description';
  }

  // if (!task.priority || typeof Number(task.priority) != 'number') {
  //   throw 'You must provide a valid priority';
  // }

  // if (
  //   !task.dueDate ||
  //   typeof task.dueDate != 'object' ||
  //   !Date.parse(new Date(task.dueDate))
  // ) {
  //   throw 'You must provide a valid dueDate';
  // }

  // if (
  //   !task.reminderDate ||
  //   typeof task.reminderDate != 'object' ||
  //   !Date.parse(new Date(task.reminderDate))
  // ) {
  //   throw 'You must provide a valid reminderDate';
  // }

  // if (!task.status || typeof task.status != 'string') {
  //   throw 'You must provide a valid status';
  // }

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
