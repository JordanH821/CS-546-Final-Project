const dbConnection = require('../../config/mongoConnection');
const { users, tasks, comments } = require('../../data');

const userList = require('./users');
const taskList = require('./tasks');
const commentList = require('./comments');

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    // create users
    let createdUsers = [];
    try {
        for (const user of userList) {
            let u = await users.createUser(
                user.firstName,
                user.lastName,
                user.email,
                user.password,
                user.phone.mobile,
                user.phone.home,
                user.phone.work
            );
            createdUsers.push(u);
        }
    } catch (e) {
        console.log(`Error adding users: ${e}`);
        db.serverConfig.close();
        return;
    }

    // create tasks
    let createdTasks = [];
    let i = 0;
    try {
        for (const task of taskList) {
            let t = await tasks.addTask(
                createdUsers[i]._id,
                task.dueDate,
                task.priority,
                task.title,
                task.description,
                task.reminderDate,
                task.status,
                createdUsers[i + 1]._id
            );
            createdTasks.push(t);
            i = i + 1;
        }
    } catch (e) {
        console.log(`Error adding tasks: ${e}`);
        db.serverConfig.close();
        return;
    }
    // create comments
    let createdComments = [];
    i = 0;
    for (const comment of commentList) {
        let c = await comments.addComment(
            createdUsers[i]._id,
            comment.datePosted,
            createdTasks[i]._id,
            comment.comment
        );
        createdComments.push(c);
        i = i + 1;
    }

    // add subTasks to tasks
    for (const task of createdTasks.slice(1)) {
        await tasks.addSubTaskToTask(createdTasks[0]._id, task._id);
    }

    // add dependencies to tasks
    for (const task of createdTasks.slice(1)) {
        await tasks.addDependencyToTask(createdTasks[0]._id, task._id);
    }

    // add tags to tasks
    for (const task of createdTasks) {
        await tasks.addTagToTask(task._id, 'Important');
        await tasks.addTagToTask(task._id, 'CS546');
        await tasks.addTagToTask(task._id, 'TaskTrack');
    }

    // add comments to tasks
    i = 0;
    for (const task of createdTasks) {
        await tasks.addCommentToTask(task._id, createdComments[i]._id);
        i = i + 1;
    }

    await db.serverConfig.close();
}

main();
