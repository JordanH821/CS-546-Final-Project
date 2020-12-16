const dbConnection = require('../../config/mongoConnection');
const { users, tasks, comments } = require('../../data');

const userList = require('./data');

async function main() {
    console.log('Starting seed task...');
    const db = await dbConnection();
    await db.dropDatabase();

    // create users
    try {
        for (const user of userList) {
            let u;
            try {
                u = await users.seedUser(
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.password,
                    user.phone.mobile,
                    user.phone.home,
                    user.phone.work
                );
            } catch (e) {
                console.log(`Error adding user: ${e}`);
                db.serverConfig.close();
                return;
            }

            // create tasks for user
            if ('tasks' in user) {
                try {
                    // date_i is how many days ahead of now each task will be.
                    // 0 will make first 2 tasks show in notification bar
                    // if you want to test no tasks in notification bar, use 3 or higher.
                    let date_i = 1;
                    for (const task of user.tasks) {
                        
                        // build dynamic dates for seed so they are valid as of today
                        let dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + date_i);
                        dueDate.setHours(0, 0, 0, 0);
                        console.log(dueDate)
                        let reminderDate = new Date();
                        reminderDate.setDate(reminderDate.getDate() + date_i - 1);

                        let t = await tasks.addTask(
                            u._id.toString(),
                            task.title,
                            task.description,
                            task.priority,
                            dueDate,
                            reminderDate,
                            task.status,
                            u.firstName,
                            task.tags.join(', '),
                            task.subtasks,
                            task.dependencies
                        );

                        // increment dynamic date
                        date_i++;

                        // add comments
                        if ('comments' in task) {
                            for (const comment of task.comments) {
                                let c = await comments.addComment(
                                    u._id.toString(),
                                    comment.datePosted,
                                    t._id.toString(),
                                    comment.comment
                                );
                                await tasks.addCommentToTask(t._id, c._id);
                            }
                        }
                        await users.addTaskToUser(u._id, t._id);
                    }
                } catch (e) {
                    console.log(`Error adding task: ${e}`);
                    db.serverConfig.close();
                    return;
                }
            }
        }
    } catch (e) {
        console.log(`Seed error: ${e}`);
        db.serverConfig.close();
        return;
    }

    await db.serverConfig.close();
    console.log('Seed task completed');
}

main();
