const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { hashPassword, comparePasswordToHash } = require('../auth/auth');
const {
    validateStringInput,
    validateEmail,
    validatePhoneNumber,
} = require('../inputValidation');

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
    const user = await usersCollection.findOne({ _id: id });
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

module.exports = { createUser, getUserByEmail, authenticateUser };
