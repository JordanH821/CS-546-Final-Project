const ObjectID = require('mongodb').ObjectID;

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
  if (!Number.isInteger(priority) || priority < 1 || priority > 10) throw error;
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

module.exports = {
  validateStringInput,
  validateEmail,
  validatePhoneNumber,
  validateObjectId,
  validateDate,
  validateStatus,
  validatePriority,
  validateTags
};
