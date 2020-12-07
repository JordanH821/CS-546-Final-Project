const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const users = require('./users');

const validateFullTask = function (task) {
    if (!task || typeof task != 'object') {
        throw 'You must provide valid task';
    }

    if (
        !task.creatorId ||
        !mongoDB.ObjectID.isValid(String(task.creatorId))
    ) {
        throw 'You must provide valid creatorId';
    }

    if (!task.dueDate || typeof task.dueDate != 'object' || !Date.parse(task.dueDate)) {
        throw 'You must provide a valid dueDate';
    }

    if (!task.priority || typeof task.priority != 'number') {
        throw 'You must provide a valid priority';
    }

    if (!task.title || typeof task.title != 'string') {
        throw 'You must provide a valid title';
    }

    if (!task.description || typeof task.description != 'string') {
        throw 'You must provide a valid description';
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

    if (
        !task.assignee ||
        !mongoDB.ObjectID.isValid(String(task.assignee))
    ) {
        throw 'You must provide a valid assignee';
    }

    // if (!task.subTasks || !Array.isArray(task.subTasks)) {
    //     throw 'You must provide valid subTasks';
    // } else {
    //     task.subTasks.forEach((subTask) => {
    //         if (!mongoDB.ObjectID.isValid(subTask)) {
    //             throw 'You must provide valid subTasks';
    //         }
    //     });
    // }

    // if (!task.dependencies || !Array.isArray(task.dependencies)) {
    //     throw 'You must provide valid dependencies';
    // } else {
    //     task.dependencies.forEach((dependency) => {
    //         if (!mongoDB.ObjectID.isValid(dependency)) {
    //             throw 'You must provide valid dependencies';
    //         }
    //     });
    // }

    // if (!task.tags || !Array.isArray(task.tags)) {
    //     throw 'You must provide valid tags';
    // } else {
    //     task.tags.forEach((tag) => {
    //         if (typeof tag != 'string') {
    //             throw 'You must provide valid tags';
    //         }
    //     });
    // }

    // if (!task.comments || !Array.isArray(task.comments)) {
    //     throw 'You must provide valid tags';
    // } else {
    //     task.comments.forEach((comment) => {
    //         if (!mongoDB.ObjectID.isValid(comment)) {
    //             throw 'You must provide valid tags';
    //         }
    //     });
    // }
};

const validatePartialTask = function (task) {
    if (!task || typeof task != 'object') {
        throw 'You must provide valid task';
    }

    if (task.creatorId) {
        if (
            !mongoDB.ObjectID.isValid(String(task.creatorId))
        ) {
            throw 'You must provide valid creatorId';
        }
    }

    if (task.dueDate) {
        if (!task.dueDate || typeof task.dueDate != 'object' || !Date.parse(task.dueDate)) {
            throw 'You must provide a valid dueDate';
        }
    }

    if (task.priority) {
        if (typeof task.priority != 'number') {
            throw 'You must provide a valid priority';
        }
    }

    if (task.title) {
        if (typeof task.title != 'string') {
            throw 'You must provide a valid title';
        }
    }

    if (task.description) {
        if (typeof task.description != 'string') {
            throw 'You must provide a valid description';
        }
    }

    if (task.reminderDate) {
        if (!task.dueDate || typeof task.dueDate != 'object' || !Date.parse(task.dueDate)) {
            throw 'You must provide a valid reminderDate';
        }
    }

    if (task.status) {
        if (typeof task.status != 'string') {
            throw 'You must provide a valid status';
        }
    }

    if (task.assignee) {
        if (
            !mongoDB.ObjectID.isValid(String(task.assignee))
        ) {
            throw 'You must provide a valid assignee';
        }
    }

    // if (task.subTasks) {
    //     throw 'cannot patch subTasks, please use "addSubTaskToTask"';
    // }

    // if (task.dependencies) {
    //     throw 'cannot patch dependencies, please use "addDependencyToTask"';
    // }

    // if (task.tags) {
    //     throw 'cannot patch tags, please use "addTagToTask"';
    // }

    // if (task.comments) {
    //     throw 'cannot patch comments, please use "addCommentToTask"';
    // }
};

let exportedMethods = {
    // GET /task
    async getAlltasks() {
        const taskCollection = await tasks();
        return await taskCollection.find({}).toArray();
    },

    // GET /task/{id}
    async getTaskById(id) {
        if (!id || !mongoDB.ObjectID.isValid(String(id))) {
            throw 'You must provide valid id';
        }

        const taskCollection = await tasks();
        let task = await taskCollection.findOne({
            _id: mongoDB.ObjectID(String(id)),
        });
        if (!task) throw 'task not found';
        return task;
    },

    // POST /task
    async addTask(
        creatorId,
        dueDate,
        priority,
        title,
        description,
        reminderDate,
        status,
        assignee
    ) {
        let newTask = {
            creatorId: creatorId,
            dueDate: dueDate,
            priority: priority,
            title: title,
            description: description,
            reminderDate: reminderDate,
            status: status,
            assignee: assignee,
            dateModified: Date.now(),
            subTasks: [],
            dependencies: [],
            tags: [],
            comments: [],
        };

        validateFullTask(newTask);

        const taskCollection = await tasks();
        const newInsertInformation = await taskCollection.insertOne(newTask);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

        return await this.getTaskById(newInsertInformation.insertedId);
    },

    // PATCH /task/{id}
    async updateTask(id, updatedTask) {
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
            comments: task.comments,
        };

        const taskCollection = await tasks();
        const updateInfo = await taskCollection.updateOne(
            { _id: mongoDB.ObjectID(String(id)) },
            { $set: taskUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return await this.getTaskById(id);
    },

    // DELETE /task/{id}
    async removeTask(id) {
        if (!id || !mongoDB.ObjectID.isValid(String(id))) {
            throw 'You must provide valid id';
        }

        const taskCollection = await tasks();
        const deletionInfo = await taskCollection.removeOne({
            _id: mongoDB.ObjectID(String(id)),
        });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete task with id of ${id}`;
        }
        return { taskId: String(id), deleted: true };
    },

    async addSubTaskToTask(taskId, subtaskId) {
        if (
            !taskId ||
            !mongoDB.ObjectID.isValid(String(taskId))
        ) {
            throw 'You must provide valid taskId';
        }

        if (
            !subtaskId ||
            !mongoDB.ObjectID.isValid(String(subtaskId))
        ) {
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
    },

    async addDependencyToTask(taskId, dependencyId) {
        if (
            !taskId ||
            !mongoDB.ObjectID.isValid(String(taskId))
        ) {
            throw 'You must provide valid taskId';
        }

        if (
            !dependencyId ||
            !mongoDB.ObjectID.isValid(String(dependencyId))
        ) {
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
    },

    async addTagToTask(taskId, tag) {
        if (
            !taskId ||
            !mongoDB.ObjectID.isValid(String(taskId))
        ) {
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
    },

    async addCommentToTask(taskId, commentId) {
        if (
            !taskId ||
            !mongoDB.ObjectID.isValid(String(taskId))
        ) {
            throw 'You must provide valid taskId';
        }

        if (
            !commentId ||
            !mongoDB.ObjectID.isValid(String(commentId))
        ) {
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
    },

    async updateTaskStatus(taskId, status) {
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
        
    },

    sortTasksByDate(tasks, status) {
        return tasks.sort(function (a, b) {
            return new Date(a.dateModified) - new Date(b.dateModified);
        });
    }
};

module.exports = exportedMethods;
