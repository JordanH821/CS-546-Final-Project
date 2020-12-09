const mongoCollections = require('../config/mongoCollections');
const mongoDB = require('mongodb');
const users = mongoCollections.users;
const { hashPassword, comparePasswordToHash } = require('../auth/auth');
const {
    validateStringInput,
    validateEmail,
    validatePhoneNumber,
} = require('../inputValidation');
const { ObjectID } = require('mongodb');
const tasks = require('./tasks');

async function createUser(
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    homeNumber,
    workNumber
) {
    firstName = validateStringInput(firstName, 'First Name');
    lastName = validateStringInput(lastName, 'Last Name');
    email = validateEmail(email);
    validateStringInput(password, 'Password');
    validatePhoneNumber(mobileNumber, 'Mobile');
    validatePhoneNumber(homeNumber, 'Home');
    validatePhoneNumber(workNumber, 'Work');
    let usersCollection = await users();
    const emailInUse = await usersCollection.findOne({ email: email });
    if (emailInUse)
        throw `There is already an account with that email address (${email})`;
    const insertedInfo = await usersCollection.insertOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        hashedPassword: await hashPassword(password), // TODO hash
        phone: { mobile: mobileNumber, home: homeNumber, work: workNumber },
        tasks: [],
    });
    if (insertedInfo.insertedCount === 0) throw 'Could not create user';
    return await getUserById(insertedInfo.insertedId);
}

async function getUserById(id) {
    // TODO validate ID
    let usersCollection = await users();
    let allUsers = await usersCollection.find({}).toArray();
    const user = await usersCollection.findOne({ _id: ObjectID(id) });
    if (user) {
        return user;
    } else {
        throw `no use exists with id (${id})`;
    }
}

async function getUserByEmail(email) {
    email = validateEmail(email);
    let usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });
    if (user) {
        return user;
    } else {
        // TODO change to generic invalid username / password
        throw `no use exists with email (${email})`;
    }
}

async function authenticateUser(email, password) {
    let user = await getUserByEmail(email);
    if (comparePasswordToHash(password, user.hashedPassword)) return user;
    throw 'Invalid username or password';
}

async function addTaskToUser(userId, taskId) {
    let user = await getUserById(userId);
    user.tasks.push(taskId);

    let usersCollection = await users();
    const updateUser = await usersCollection.replaceOne({ _id: userId }, user);

    if (updateUser.modifiedCount === 0) throw 'could not update user!';

    return await getUserById(userId);
}


async function getAllTasksForUser(userId) {
    if (!userId || !mongoDB.ObjectID.isValid(String(userId))) {
        throw 'You must provide a valid user id'
    }

    const user = await this.getUserById(userId);

    // get all tasks for user
    let allTasks = [];
    for (let i = 0; i < user.tasks.length; i++) {
        const task = await tasks.getTaskById(user.tasks[i]);
        if (task) {
            allTasks.push(task);
        }
    };

    return allTasks;
}

module.exports = { createUser, getUserByEmail, getUserById, authenticateUser, getAllTasksForUser, addTaskToUser };
