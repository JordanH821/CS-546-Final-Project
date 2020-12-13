const dbConnection = require('../../config/mongoConnection');
const { users, tasks, comments } = require('../../data');

const userList = require('./users');
const taskList = require('./tasks');
const commentList = require('./comments');

async function main() {
    console.log('Starting seed task...');
    const db = await dbConnection();
    await db.dropDatabase();

    // create users
    let createdUsers = [];
    try {
        for (const user of userList) {
            let u = await users.seedUser(
                user.firstName,
                user.lastName,
                user.email,
                user.password,
                user.phone.mobile,
                user.phone.home,
                user.phone.work
            );
            createdUsers.push(u);

            // create taskes for user
            const tasksForUser = taskList[0];
            console.log(tasksForUser);
            for (const task of tasksForUser) {
                let t = await tasks.addTask(
                    u._id,
                    task.dueDate,
                    task.priority,
                    task.title,
                    task.description,
                    task.reminderDate,
                    task.status,
                    u._id
                );

                // add tags // TODO: probably add tags when creating task
                for (const tag of task.tags) {
                    await tasks.addTagToTask(t._id, tag);
                }

                await users.addTaskToUser(u._id, t._id);
            }
        }
    } catch (e) {
        console.log(`Error adding users: ${e}`);
        db.serverConfig.close();
        return;
    }

    // create tasks
    // let createdTasks = [];
    // let i = 0;
    // try {
    //     for (const task of taskList) {
    //         const userId = createdUsers[i + 1]._id;
    //         let t = await tasks.addTask(
    //             createdUsers[i]._id,
    //             task.dueDate,
    //             task.priority,
    //             task.title,
    //             task.description,
    //             task.reminderDate,
    //             task.status,
    //             userId
    //         );
    //         createdTasks.push(t);

    //         // add task to user
    //         users.addTaskToUser(userId, t._id);

    //         // increment user
    //         i = i + 1;
    //     }
    // } catch (e) {
    //     console.log(`Error adding tasks: ${e}`);
    //     db.serverConfig.close();
    //     return;
    // }
    // create comments
    // let createdComments = [];
    // i = 0;
    // for (const comment of commentList) {
    //     let c = await comments.addComment(
    //         createdUsers[i]._id,
    //         comment.datePosted,
    //         createdTasks[i]._id,
    //         comment.comment
    //     );
    //     createdComments.push(c);
    //     i = i + 1;
    // }

    // add subTasks to tasks
    // for (const task of createdTasks.slice(1)) {
    //     await tasks.addSubTaskToTask(createdTasks[0]._id, task._id);
    // }

    // add dependencies to tasks
    // for (const task of createdTasks.slice(1)) {
    //     await tasks.addDependencyToTask(createdTasks[0]._id, task._id);
    // }

    // // add tags to tasks
    // for (const task of createdTasks) {
    //     await tasks.addTagToTask(task._id, 'Important');
    //     await tasks.addTagToTask(task._id, 'CS546');
    //     await tasks.addTagToTask(task._id, 'TaskTrack');
    // }

    // add comments to tasks
    // i = 0;
    // for (const task of createdTasks) {
    //     await tasks.addCommentToTask(task._id, createdComments[i]._id);
    //     i = i + 1;
    // }

    await db.serverConfig.close();
    console.log('Seed task completed');
}

main();
