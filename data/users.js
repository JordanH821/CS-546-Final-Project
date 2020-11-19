const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');

async function createUser(
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    homeNumber,
    workNumber
) {
    // firstName = validateStringInput(firstName);
    // lastName = validateStringInput(firstName);
    // email = validateEmail(email);
    // validatePassword(password);
    // validatePhoneNumber(mobileNumber);
    // validatePhoneNumber(homeNumber);
    // validatePhoneNumber(workNumber);
    let usersCollection = await users();
    const insertedInfo = await usersCollection.insertOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password, // TODO hash
        phone: { mobile: mobileNumber, home: homeNumber, work: workNumber },
        tasks: [],
    });
    if (insertedInfo.insertedCount === 0) throw 'Could not create user';
    // return await getUserById(insertedInfo.insertedId.toString());
    return true;
}

module.exports = { createUser };
