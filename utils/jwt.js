const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "jfdlksfjlskfjl";

module.exports.sign = (payload) => {
  return jwt.sign(payload, PRIVATE_KEY, { expiresIn: "1h" });
};

module.exports.verify = (token) => {
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    return decoded;
  } catch (err) {
    return false;
  }
};
