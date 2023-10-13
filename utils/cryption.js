const jwt = require("jsonwebtoken");
const { hashSync, compareSync } = require("bcrypt");

const {
  JWT_SCERET_KEY,
  BCRYPT_SALT_ROUNDS,
  JWT_EXPIRES_IN,
} = require("../constants");

module.exports.sign = (payload) => {
  return jwt.sign(payload, JWT_SCERET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

module.exports.verify = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SCERET_KEY);
    return decoded;
  } catch (err) {
    return false;
  }
};

module.exports.hashString = (str) => {
  return hashSync(str, BCRYPT_SALT_ROUNDS);
};

module.exports.verifyString = (str, hashedStr) => {
  return compareSync(str, hashedStr);
};
