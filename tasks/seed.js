const dbConnection = require('../config/mongoConnection');
const data = require('../data/');

const userList = require('./users');
const taskList = require('./tasks');
const commentList = require('./comments');

async function main() {
  const db = await dbConnection();

  // create users
  let createdUsers = [];
  
  for (const user of userList) {
    let u = await data.users.createUser(
      user.firstName, user.lastName, user.email, user.password, 
      user.phone.mobile, user.phone.home, user.phone.work
    )
    createdUsers.push(u);
  }

  // create tasks
  let createdTasks = [];
  let i = 0;
  for (const task of taskList) {
    let t = await data.tasks.addTask(
      createdUsers[i]._id, task.dueDate, task.priority, 
      task.title, task.description, task.reminderDate, 
      task.status, createdUsers[i+1]._id, task.subTasks, 
      task.dependencies, task.tags, task.comments
    )
    createdTasks.push(t);
    i = i + 1;
  }

  // create comments
  let createdComments = [];
  i = 0;
  for (const comment of commentList) {
    let c = await data.comments.addComment(
      createdUsers[i]._id, comment.datePosted, 
      createdTasks[i]._id, comment.comment
    )
    createdComments.push(c);
    i = i + 1;
  }

  // add subTasks to tasks
  for (const task of taskList.slice(1)) {
    await data.tasks.addSubTaskToTask(createdTasks[0]._id, task._id)
  }

  // add dependencies to tasks
  for (const task of taskList.slice(1)) {
    await data.tasks.addDependencyToTask(createdTasks[0]._id, task._id)
  }

  // add tags to tasks
  for (const task of taskList.slice(1)) {
    await data.tasks.addTagToTask(task._id, "Important")
    await data.tasks.addTagToTask(task._id, "CS546")
    await data.tasks.addTagToTask(task._id, "TaskTrack")
  }

  // add comments to tasks
  i = 0;
  for (const task of taskList) {
    await data.tasks.addCommentToTask(task._id, createdComments[i]._id)
    i = i + 1;
  }

  await db.serverConfig.close();
}

main();
