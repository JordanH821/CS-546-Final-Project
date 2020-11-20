const bcrypt = require('bcrypt');
const saltRounds = 16;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

module.exports = { hashPassword };
