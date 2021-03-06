const ObjectID = require('mongodb').ObjectID;

function validateStringInput(input, name) {
    if (input === undefined || input === null)
        throw `${name} is null or undefined, but must be a non-empty string`;
    if (typeof input !== 'string')
        throw `${name} is of type ${typeof input}, but must be a string`;
    if (!input) throw `${name} cannot be empty`;
    // check for all whitespace
    // https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
    if (input.replace(/\s/g, '').length === 0)
        throw `string cannot be all white space`;
    // return successfully validated string without trailing and preceedig whitespace
    return input.trim();
}

function validateEmail(email) {
    email = validateStringInput(email, 'Email Address');
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase())) {
        return email;
    }
    throw `Email Address (${email}) is not valid`;
}

function validatePhoneNumber(phoneNumber, type) {
    if (phoneNumber === null || phoneNumber === undefined)
        throw `${type} Phone Number cannot be null or undefined`;
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!re.test(phoneNumber)) {
        throw `${type} Phone Number (${phoneNumber}) is not valid. Please enter a valid 10-digit phone number without separators or separated by spaces, dashes, or periods`;
    }
}

function validateObjectId(id) {
    if (id === null || id === undefined)
        throw `id was null or undefined, but must be a valid ObjectId`;
    if (typeof id !== 'string')
        throw `id (${id}) was of type (${typeof id}), but must be a valid ObjectId in string form`;
    if (id.length === 0)
        throw `id is an empty string, but must be a valid ObjectId in string form`;
    if (!ObjectID.isValid(id)) throw `id (${id}) is not a valid ObjectId`;
    return ObjectID(id);
}

function validateDate(date, name) {
    const error = `${name} is not a valid date`;
    try {
        validateStringInput(date, name);
    } catch (e) {
        throw error;
    }
    date = new Date(date);
    if (Number.isNaN(date)) throw error;
}

function validateStatus(status) {
    const error = `Status: (${status}) is not a valid status (To Do, In Progress, Done).`;
    try {
        validateStringInput(status);
    } catch (e) {
        throw error;
    }
    if (['To Do', 'In Progress', 'Done', 'Archived'].indexOf(status) < 0)
        throw error;
}

function validatePriority(priority) {
    const error = `Priority: (${priority}) is not a valid priority (1-10 inclusive).`;
    try {
        validateStringInput(priority);
    } catch (e) {
        throw error;
    }
    priority = Number(priority);
    if (!Number.isInteger(priority) || priority < 1 || priority > 10)
        throw error;
    return priority;
}

function validateTags(tags) {
    const error = `Tags: (${tags}) is not a valid tag string. It must be a comma-separated list of strings`;
    try {
        validateStringInput(tags);
        const tagList = tags.split(',');
        tagList.forEach((tag, index) => {
            tagList[index] = validateStringInput(tag, 'Tag');
        });
        return tagList;
    } catch (e) {
        throw error;
    }
}

function validateSubtasks(subtasks) {
    if (subtasks === null || subtasks === undefined)
        throw `Subtasks cannot be null or undefined`;
    if (typeof subtasks === 'string' && subtasks.length === 0) return [];
    if (!Array.isArray(subtasks)) throw `Subtasks must be a list of strings`;
    subtasks.forEach((subtask, index) => {
        subtasks[index] = validateStringInput(subtask, 'Subtask');
    });
    return subtasks;
}

function validateDependencies(dependencies) {
    if (dependencies === null || dependencies === undefined)
        throw `Dependencies cannot be null or undefined`;
    if (typeof dependencies === 'string' && dependencies.length === 0)
        return [];
    if (!Array.isArray(dependencies))
        throw `Dependencies must be a list of strings`;
    dependencies.forEach((dependency, index) => {
        dependencies[index] = validateObjectId(dependencies[index]);
    });
    return dependencies;
}

function validateDueDate(dueDate) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let dL = dueDate.split('-');
    let dueDateConv = new Date(dL);
    dueDateConv.setHours(0, 0, 0, 0);
    if (dueDateConv < today)
        throw `Due date cannot be before today's date. Please set due date to a future date`;
}

function validateReminderDate(reminderDate, dueDate) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    let dueDateConv = new Date(dueDate.split('-'));
    let reminderDateConv = new Date(reminderDate.split('-'));
    reminderDateConv.setHours(0, 0, 0, 0);
    if (reminderDateConv < today)
        throw "Reminder date cannot be before today's date. Please set reminder date to a future date";
    if (reminderDateConv > dueDateConv)
        throw 'Reminder date cannot be after or on due date. Please set reminder date to be before due date';
}

module.exports = {
    validateStringInput,
    validateEmail,
    validatePhoneNumber,
    validateObjectId,
    validateDate,
    validateStatus,
    validatePriority,
    validateTags,
    validateSubtasks,
    validateDependencies,
    validateDueDate,
    validateReminderDate,
};
