const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { hashPassword } = require('../auth/auth');
const {
    validateStringInput,
    validateEmail,
    validatePhoneNumber,
} = require('../validation/serverSide');

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
    validateStringInput(password);
    validatePhoneNumber(mobileNumber, 'Mobile');
    validatePhoneNumber(homeNumber, 'Home');
    console.log(workNumber);
    validatePhoneNumber(workNumber, 'Work');
    let usersCollection = await users();
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
    let usersCollection = await users();
    const user = await usersCollection.findOne({ _id: id });
    if (user) {
        return user;
    } else {
        throw `no use exists with id (${id})`;
    }
}

module.exports = { createUser };
