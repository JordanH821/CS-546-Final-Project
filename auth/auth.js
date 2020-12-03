const bcrypt = require('bcryptjs');
const saltRounds = 16;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePasswordToHash(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePasswordToHash };
