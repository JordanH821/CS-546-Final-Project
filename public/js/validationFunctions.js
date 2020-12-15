function validateStringInput(input, name) {
    if (input === undefined || input === null)
        throw `${name} is null or undefined, but must be a non-empty string`;
    if (typeof input !== 'string')
        throw `${name} is of type ${typeof input}, but must be a string`;
    if (!input) throw `${name} cannot be an empty string`;
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

function validateDate(date, name) {
    date = Date.parse(date);
    if (Number.isNaN(date)) {
        throw `${name} is invalid`;
    }
}

function validateSelect(field, name) {
    try {
        validateStringInput(field, name);
    } catch (e) {
        throw `You must select a value for ${name}`;
    }
}

function validateTags(tags) {
    const tagList = tags.split(',');
    try {
        tagList.forEach((tag, index) => {
            tagList[index] = validateStringInput(tag, 'Tag');
        });
        return tagList;
    } catch (e) {
        throw `Invalid Tag String. You must provide at least one tag, with additional tags separated by a comma.`;
    }
}

function validateDueDate(dueDate) {
    let today = new Date();
    let dueDateConv = new Date(dueDate);
    if (dueDateConv < today)
        throw `Due date cannot be before today's date. Please set due date to a future date`;
}

function validateReminderDate(reminderDate, dueDate) {
    let today = new Date();
    let dueDateConv = new Date(dueDate);
    let reminderDateConv = new Date(reminderDate);
    if (reminderDateConv < today)
        throw "Reminder date cannot be before today's date. Please set reminder date to a future date";
    if (reminderDateConv > dueDateConv)
        throw 'Reminder date cannot be after or on due date. Please set reminder date to be before due date';
}
