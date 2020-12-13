const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const users = require('./users');

const validateFullTask = function(task) {
  if (!task || typeof task != 'object') {
    throw 'You must provide valid task';
  }

  if (!task.title || typeof task.title != 'string' || task.title.trim() == '') {
    throw 'You must provide a valid title1';
  }
  if (
    !task.description ||
    typeof task.description != 'string' ||
    task.description.trim() == ''
  ) {
    throw 'You must provide a valid description';
  }

  if (!task.priority || typeof task.priority != 'number') {
    throw 'You must provide a valid priority';
  }

  if (
    !task.dueDate ||
    typeof task.dueDate != 'object' ||
    !Date.parse(task.dueDate)
  ) {
    throw 'You must provide a valid dueDate';
  }

  if (
    !task.reminderDate ||
    typeof task.reminderDate != 'object' ||
    !Date.parse(task.reminderDate)
  ) {
    throw 'You must provide a valid reminderDate';
  }

  if (!task.status || typeof task.status != 'string') {
    throw 'You must provide a valid status';
  }

  //   if (!task.assignee || !mongoDB.ObjectID.isValid(String(task.assignee))) {
  //     throw 'You must provide a valid assignee';
  //   }
  if (!task.assignee || typeof task.assignee != 'object') {
    throw 'You must provide a valid assignee';
  }
  if (!task.tags || typeof task.tags != 'object') {
    throw 'You must provide a valid tags';
  }

  if (!task.creatorId || !mongoDB.ObjectID.isValid(String(task.creatorId))) {
    throw 'You must provide valid creatorId';
  }
};

const validatePartialTask = function(task) {
  if (!task || typeof task != 'object') {
    throw 'You must provide valid task';
  }

  if (!task.title || typeof task.title != 'string' || task.title.trim() == '') {
    throw 'You must provide a valid title2';
  }
  if (
    !task.description ||
    typeof task.description != 'string' ||
    task.description.trim() == ''
  ) {
    throw 'You must provide a valid description';
  }

  if (!task.priority || typeof task.priority != 'number') {
    throw 'You must provide a valid priority';
  }

  if (
    !task.dueDate ||
    typeof task.dueDate != 'object' ||
    !Date.parse(task.dueDate)
  ) {
    throw 'You must provide a valid dueDate';
  }

  if (
    !task.reminderDate ||
    typeof task.reminderDate != 'object' ||
    !Date.parse(task.reminderDate)
  ) {
    throw 'You must provide a valid reminderDate';
  }

  if (!task.status || typeof task.status != 'string') {
    throw 'You must provide a valid status';
  }

  //   if (!task.assignee || !mongoDB.ObjectID.isValid(String(task.assignee))) {
  //     throw 'You must provide a valid assignee';
  //   }
  if (!task.assignee || typeof task.assignee != 'object') {
    throw 'You must provide a valid assignee';
  }
  if (!task.tags || typeof task.tags != 'object') {
    throw 'You must provide a valid tags';
  }

  if (!task.creatorId || !mongoDB.ObjectID.isValid(String(task.creatorId))) {
    throw 'You must provide valid creatorId';
  }
};

// GET /task
async function getAlltasks() {
  const taskCollection = await tasks();
  return await taskCollection.find({}).toArray();
}

// GET /task/{id}
async function getTaskById(id) {
  if (!id || !mongoDB.ObjectID.isValid(String(id))) {
    throw 'You must provide valid id';
  }

  const taskCollection = await tasks();
  let task = await taskCollection.findOne({
    _id: mongoDB.ObjectID(String(id))
  });
  if (!task) throw 'task not found';
  return task;
}

// POST /task
async function addTask(
  creatorId,
  title,
  description,
  priority,
  dueDate,
  reminderDate,
  status,
  assignee = [],
  tags = []
) {
  try {
    let newTask = {
      dateModified: Date.now(),
      creatorId: creatorId,
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate,
      reminderDate: reminderDate,
      status: status,
      assignee: assignee,
      tags: tags,
      subTasks: [],
      dependencies: [],
      comments: []
    };

    validateFullTask(newTask);

    const taskCollection = await tasks();
    const newInsertInformation = await taskCollection.insertOne(newTask);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return await this.getTaskById(newInsertInformation.insertedId);
  } catch (e) {
    console.log(e);
  }
}

// PATCH /task/{id}
async function updateTask(id, updatedTask) {
  validatePartialTask(updatedTask);

  if (!id || !mongoDB.ObjectID.isValid(String(id))) {
    throw 'You must provide valid id';
  }

  const task = await this.getTaskById(id);

  let taskUpdateInfo = {
    creatorId: updatedTask.creatorId,
    dueDate: updatedTask.dueDate,
    priority: updatedTask.priority,
    title: updatedTask.title,
    description: updatedTask.description,
    reminderDate: updatedTask.reminderDate,
    status: updatedTask.status,
    assignee: updatedTask.assignee,
    dateModified: Date.now(),
    subTasks: task.subTasks,
    dependencies: task.dependencies,
    tags: task.tags,
    comments: task.comments
  };

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: mongoDB.ObjectID(String(id)) },
    { $set: taskUpdateInfo }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed';

  return await this.getTaskById(id);
}

// DELETE /task/{id}
async function removeTask(id) {
  if (!id || !mongoDB.ObjectID.isValid(String(id))) {
    throw 'You must provide valid id';
  }

  const taskCollection = await tasks();
  const deletionInfo = await taskCollection.removeOne({
    _id: mongoDB.ObjectID(String(id))
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete task with id of ${id}`;
  }
  return { taskId: String(id), deleted: true };
}

async function addSubTaskToTask(taskId, subtaskId) {
  if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
    throw 'You must provide valid taskId';
  }

  if (!subtaskId || !mongoDB.ObjectID.isValid(String(subtaskId))) {
    throw 'You must provide valid subtaskId';
  }

  let subtask = this.getTaskById(subtaskId);

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: mongoDB.ObjectID(String(taskId)) },
    { $addToSet: { subTasks: subtaskId } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed';

  return await this.getTaskById(taskId);
}

async function addDependencyToTask(taskId, dependencyId) {
  if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
    throw 'You must provide valid taskId';
  }

  if (!dependencyId || !mongoDB.ObjectID.isValid(String(dependencyId))) {
    throw 'You must provide valid subtaskId';
  }

  let dependency = this.getTaskById(dependencyId);

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: mongoDB.ObjectID(String(taskId)) },
    { $addToSet: { dependencies: dependencyId } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed';

  return await this.getTaskById(taskId);
}

async function addTagToTask(taskId, tag) {
  if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
    throw 'You must provide valid taskId';
  }

  if (!tag || typeof tag != 'string') {
    throw 'You must provide valid tag';
  }

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: mongoDB.ObjectID(String(taskId)) },
    { $addToSet: { tags: tag } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed';

  return await this.getTaskById(taskId);
}

async function addCommentToTask(taskId, commentId) {
  if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
    throw 'You must provide valid taskId';
  }

  if (!commentId || !mongoDB.ObjectID.isValid(String(commentId))) {
    throw 'You must provide valid commentId';
  }

  const taskCollection = await tasks();
  const updateInfo = await taskCollection.updateOne(
    { _id: mongoDB.ObjectID(String(taskId)) },
    { $addToSet: { comments: commentId } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Update failed';

  return await this.getTaskById(taskId);
}
async function updateTaskStatus(taskId, status) {
  if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
    throw 'You must provide valid taskId';
  }

  if (!status || typeof status != 'string') {
    throw 'Invalid update status';
  }

  // get task
  let task = await this.getTaskById(taskId);

  // update status
  task.status = status;

  // update task in DB
  return this.updateTask(taskId, task);
}

function sortTasksByDate(tasks, status) {
  return tasks.sort(function(a, b) {
    return new Date(a.dateModified) - new Date(b.dateModified);
  });
}

async function searchUsersTasks(userId, searchTerm) {
    const tasksCollection = await tasks();
    return await tasksCollection.find({
        creatorId: mongoDB.ObjectID(userId),
        $text: {
            $search: `\"${searchTerm}\"`,
            $caseSensitive: false,
        },
    });
}

async function getTaskNotificationsForUser(userId) {
    const tasksCollection = await tasks();
    const today = new Date();
    return await tasksCollection
        .find({
            assignee: mongoDB.ObjectID(userId),
            reminderDate: { $lt: today },
            status: { $ne: 'Done' },
            status: { $ne: 'Archived' },
        })
        .sort({ dueDate: 1 })
        .toArray();
}

module.exports = {
  getAlltasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
  addSubTaskToTask,
  addDependencyToTask,
  addTagToTask,
  addCommentToTask,
  updateTaskStatus,
  sortTasksByDate,
  // createTextIndex,
  searchUsersTasks,
  // getTaskIndexes,
  getTaskNotificationsForUser,
};
