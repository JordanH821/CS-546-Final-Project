const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const users = require('./users');
const {
    validateDate,
    validateStatus,
    validateStringInput,
    validatePriority,
    validateTags,
    validateObjectId,
    validateSubtasks,
} = require('../inputValidation');

const validateFullTask = function (task) {
    if (!task || typeof task != 'object') {
        throw 'You must provide a valid task';
    }

    if (
        !task.title ||
        typeof task.title != 'string' ||
        task.title.trim() == ''
    ) {
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
        throw 'You must provide valid tags';
    }

    if (!task.creatorId || !mongoDB.ObjectID.isValid(String(task.creatorId))) {
        throw 'You must provide a valid creatorId';
    }
};

const validatePartialTask = function (task) {
    if (!task || typeof task != 'object') {
        throw 'You must provide a valid task';
    }

    if (
        !task.title ||
        typeof task.title != 'string' ||
        task.title.trim() == ''
    ) {
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
        throw 'You must provide valid tags';
    }

    if (!task.creatorId || !mongoDB.ObjectID.isValid(String(task.creatorId))) {
        throw 'You must provide a valid creatorId';
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
        _id: mongoDB.ObjectID(String(id)),
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
    assignee,
    tags,
    subtasks
) {
    validateObjectId(creatorId);
    title = validateStringInput(title, 'Title');
    description = validateStringInput(description, 'Description');
    priority = validatePriority(priority);
    validateDate(dueDate, 'Due Date');
    validateDate(reminderDate, 'Reminder Date');
    validateStatus(status);
    assignee = validateStringInput(assignee, 'Assignee');
    tags = validateTags(tags);
    validateSubtasks(subtasks);

    let newTask = {
        dateModified: new Date(Date.now()),
        creatorId: new mongoDB.ObjectID(creatorId),
        title: title,
        description: description,
        priority: priority,
        dueDate: new Date(dueDate),
        reminderDate: new Date(reminderDate),
        status: status,
        assignee: assignee,
        tags: tags,
        subtasks: subtasks,
        dependencies: [],
        comments: [],
    };

    const taskCollection = await tasks();
    const newInsertInformation = await taskCollection.insertOne(newTask);
    if (newInsertInformation.insertedCount === 0) throw 'Failed to create task';

    return await this.getTaskById(newInsertInformation.insertedId.toString());
}

async function updateTask(
    creatorId,
    taskId,
    title,
    description,
    priority,
    dueDate,
    reminderDate,
    status,
    assignee,
    tags,
    subtasks
) {
    validateObjectId(creatorId);
    validateObjectId(taskId);
    title = validateStringInput(title, 'Title');
    description = validateStringInput(description, 'Description');
    priority = validatePriority(priority);
    validateDate(dueDate, 'Due Date');
    validateDate(reminderDate, 'Reminder Date');
    validateStatus(status);
    assignee = validateStringInput(assignee, 'Assignee');
    tags = validateTags(tags);
    validateSubtasks(subtasks);
    let updateTask = {
        dateModified: new Date(Date.now()),
        creatorId: new mongoDB.ObjectID(creatorId),
        title: title,
        description: description,
        priority: priority,
        dueDate: new Date(dueDate),
        reminderDate: new Date(reminderDate),
        status: status,
        assignee: assignee,
        tags: tags,
        subtasks: subtasks,
    };
    const taskCollection = await tasks();
    const updateInfo = await taskCollection.updateOne(
        { _id: mongoDB.ObjectID(taskId) },
        { $set: updateTask }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';

    return await this.getTaskById(taskId);
}

// DELETE /task/{id}
async function removeTask(id) {
    if (!id || !mongoDB.ObjectID.isValid(String(id))) {
        throw 'You must provide a valid task id';
    }

    const taskCollection = await tasks();
    const deletionInfo = await taskCollection.removeOne({
        _id: mongoDB.ObjectID(String(id)),
    });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete task with id of ${id}`;
    }
    return { taskId: String(id), deleted: true };
}

async function addSubTaskToTask(taskId, subtaskId) {
    if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
        throw 'You must provide a valid taskId';
    }

    if (!subtaskId || !mongoDB.ObjectID.isValid(String(subtaskId))) {
        throw 'You must provide a valid subtaskId';
    }

    let subtask = this.getTaskById(subtaskId);

    const taskCollection = await tasks();
    const updateInfo = await taskCollection.updateOne(
        { _id: mongoDB.ObjectID(String(taskId)) },
        { $addToSet: { subtasks: subtaskId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';

    return await this.getTaskById(taskId);
}

async function addDependencyToTask(taskId, dependencyId) {
    if (!taskId || !mongoDB.ObjectID.isValid(String(taskId))) {
        throw 'You must provide a valid taskId';
    }

    if (!dependencyId || !mongoDB.ObjectID.isValid(String(dependencyId))) {
        throw 'You must provide a valid subtaskId';
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
    validateObjectId(taskId);
    validateStatus(status);
    await this.getTaskById(taskId);
    const taskCollection = await tasks();
    const updateInfo = await taskCollection.updateOne(
        { _id: mongoDB.ObjectID(taskId) },
        { $set: { status: status } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Task status update failed';

    return await this.getTaskById(taskId);
}

function sortTasksByDate(tasks, inverted) {
    return tasks.sort(function (a, b) {
        if (!inverted) {
            return new Date(a.dateModified) - new Date(b.dateModified);
        } else {
            return new Date(b.dateModified) - new Date(a.dateModified);
        }
    });
}

async function searchUsersTasks(userId, searchTerm) {
    const tasksCollection = await tasks();
    return await tasksCollection
        .find({
            creatorId: mongoDB.ObjectID(userId),
            $text: {
                $search: `\"${searchTerm}\"`,
                $caseSensitive: false,
            },
        })
        .toArray();
}

async function getUsersTasksByTag(userId, tag) {
    const tasksCollection = await tasks();
    return await tasksCollection
        .find({
            creatorId: mongoDB.ObjectID(userId),
            tags: tag,
        })
        .toArray();
}

async function getTaskNotificationsForUser(userId) {
    const tasksCollection = await tasks();
    const today = new Date();
    return await tasksCollection
        .find({
            creatorId: mongoDB.ObjectID(userId),
            reminderDate: { $lt: today },
            status: { $ne: 'Done' },
            status: { $ne: 'Archived' },
        })
        .sort({ dueDate: 1 })
        .toArray();
}

async function getActiveTasksForUser(userId) {
    const tasksCollection = await tasks();
    return await tasksCollection
        .find({
            creatorId: mongoDB.ObjectID(userId),
            status: { $nin: ['Done', 'Archived'] },
        })
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
    searchUsersTasks,
    getUsersTasksByTag,
    getTaskNotificationsForUser,
    getActiveTasksForUser,
};
