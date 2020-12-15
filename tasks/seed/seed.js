const dbConnection = require('../../config/mongoConnection');
const { users, tasks, comments } = require('../../data');

const userList = require('./users');

async function main() {
    console.log('Starting seed task...');
    const db = await dbConnection();
    await db.dropDatabase();

    // create users
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

            // create taskes for user
            if ('tasks' in user) {
                for (const task of user.tasks) {
                    let t = await tasks.addTask(
                        u._id.toString(),
                        task.title,
                        task.description,
                        task.priority,
                        task.dueDate,
                        task.reminderDate,
                        task.status,
                        u.firstName,
                        task.tags.join(', '),
                        task.subtasks
                    );

                    // add tags
                    if ('tags' in task) {
                        for (const tag of task.tags) {
                            await tasks.addTagToTask(t._id, tag);
                        }
                    }

                    // add comments
                    if ('comments' in task) {
                        for (const comment of task.comments) {
                            let c = await comments.addComment(
                                u._id.toString(), 
                                comment.datePosted, 
                                t._id, 
                                comment.comment
                            );
                            await tasks.addCommentToTask(t._id, c._id);
                        }
                    }

                    // add dependencies
                    if ('dependencies' in task) {
                        for (const dependency in task.dependencies) {
                            await tasks.addDependencyToTask(t._id, task.dependencies[dependency]);
                        }
                    }

                    // add subTasks
                    if ('subTasks' in task) {
                        for (const subTask of task.subTasks) {
                            let st = await tasks.addTask(
                                u._id.toString(),
                                subTask.title,
                                subTask.description,
                                subTask.priority,
                                subTask.dueDate,
                                subTask.reminderDate,
                                subTask.status,
                                u.firstName,
                                subTask.tags.join(', ')
                            );
                            if ('tags' in subTask) {
                                for (const tag of subTask.tags) {
                                    await tasks.addTagToTask(st._id, tag);
                                }
                            }
                            if ('comments' in subTask) {
                                for (const comment of subTask.comments) {
                                    let c = await comments.addComment(
                                        u._id.toString(), 
                                        comment.datePosted, 
                                        st._id, 
                                        comment.comment
                                    );
                                    await tasks.addCommentToTask(st._id, c._id);
                                }
                            }
                            if ('dependencies' in subTask) {
                                for (const dependency in subTask.depencies) {
                                    await tasks.addDependencyToTask(st._id, dependency);
                                }
                            }
                            await tasks.addSubTaskToTask(t._id, st._id);
                        }
                    }

                    await users.addTaskToUser(u._id, t._id);
                }
            }
        }
    } catch (e) {
        console.log(`Error adding users: ${e}`);
        db.serverConfig.close();
        return;
    }

    await db.serverConfig.close();
    console.log('Seed task completed');
}

main();
