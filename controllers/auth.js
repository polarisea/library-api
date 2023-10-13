const UserModel = require("../models/User.model");
const { validationResult } = require("express-validator");

const { hashString, verifyString, sign } = require("../utils/cryption");

module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  const { email, password, remember } = req.body;
  const existedUser = await UserModel.findOne({
    email,
    google: null,
    fb: null,
  });
  if (existedUser) return res.status(400).json("Email đã tồn tại");
  const user = await UserModel.create({
    email,
    password: hashString(password),
  });
  if (!user) res.status(400).json("Đăng kí thất bại");
  delete user.password;
  const token = sign({ _id: user._id, role: user.role });
  return res.json({ token, user, remember });
};

module.exports.loginByPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  const { email, password, remember } = req.body;
  const user = await UserModel.findOne({ email, google: null, fb: null });
  if (!user) return res.status(400).json("Đăng nhập thất bại");
  const isValidPassword = verifyString(password, user.password);
  if (!isValidPassword) return res.status(400).json("Đăng nhập thất bại");
  delete user.password;
  const token = sign({ _id: user._id, role: user.role });
  return res.json({ token, user, remember });
};

module.exports.me = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  const { user } = req;
  const { remember } = req.body;
  delete user.password;
  const token = sign({ _id: user._id, role: user.role });
  return res.json({ token, user, remember });
};
