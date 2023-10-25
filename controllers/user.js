const { Types } = require("mongoose");
const { validationResult } = require("express-validator");
const { unlinkSync } = require("fs");

const UserModel = require("../models/User.model");
const { convertBase64ToImage } = require("../utils");

const { PAGE_SIZE, IMAGE_HOST } = require("../constants");

module.exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { page, search, sort, role } = req.validData;
    const query = {};
    search && (query.$text = { $search: search });
    role && (query.role = role);
    const books = await UserModel.find(query)
      .sort({ [sort]: -1 })
      .skip(page * PAGE_SIZE)
      .limit(PAGE_SIZE);

    return res.json(books);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json("Tài khoản không tồn tại");
    user.password = null;
    return res.json(user);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  const user = req.user;
  const { name, email, picture, DOB, phone, address } = req.body;
  const indexedContent = `${name} ${email} ${address}`.trim();
  const data = {
    name,
    email,
    DOB,
    phone,
    address,
    indexedContent,
  };
  if (user.fb != null || user.google != null) delete data.email;
  if (picture) {
    const fileName = `${Date.now()}.jpg`;
    convertBase64ToImage(picture, `public/pictures/${fileName}`);
    data["picture"] = fileName;
  }
  try {
    unlinkSync(`public/pictures/${user.picture}`);
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
  const updatedUser = await UserModel.findByIdAndUpdate(user._id, data, {
    new: true,
  });
  res.json(updatedUser);
};

module.exports.grantPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    return res.json(user);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await UserModel.findByIdAndRemove(id);
    if (deleted) return res.json(id);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { search, role } = req.validData;
    const query = {};
    search && (query.$text = { $search: search });
    role && (query.role = role);
    const count = await UserModel.countDocuments(query);
    return res.json(count);
  } catch (e) {}
  return res.sendStatus(400);
};
