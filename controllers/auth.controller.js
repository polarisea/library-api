const UserModel = require("../models/User.model");

module.exports.login = async (req, res) => {
  const { token, user } = req;
  return res.json({ token, user });
};
