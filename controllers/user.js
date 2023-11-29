const { Types } = require("mongoose");
const { validationResult } = require("express-validator");
const { unlinkSync } = require("fs");

const UserModel = require("../models/User.model");
const { convertBase64ToImage } = require("../utils");

const { PAGE_SIZE, IMAGE_HOST } = require("../constants");

module.exports.get = async (req, res) => {
  try {
    const { page, search, sort, role } = req.query;
    const query = {};
    search && (query.$text = { $search: search });
    role && (query.role = +role);
    const books = await UserModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "contract",
          localField: "_id",
          foreignField: "user",
          as: "contracts",
        },
      },
      {
        $addFields: {
          contracts: { $size: "$contracts" },
        },
      },
      {
        $sort: {
          [sort]: -1,
        },
      },
      {
        $skip: page * PAGE_SIZE,
      },
      {
        $limit: PAGE_SIZE,
      },
    ]);

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
  try {
    const user = req.user;
    const { name, picture, DOB, phone, address } = req.body;
    const email = user.fb ? req.body.email : user.email;
    const indexedContent = `${name} ${email} ${address}`.trim();
    const data = {
      name,
      email,
      DOB,
      phone,
      address,
      indexedContent,
    };

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
    return res.json(updatedUser);
  } catch (e) {}
  return res.sendStatus(400);
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
    if (id != req.user._id) {
      const deleted = await UserModel.findByIdAndRemove(id);
      if (deleted) return res.json(id);
    }
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};
    search && (query.$text = { $search: search });
    role && (query.role = role);
    const count = await UserModel.countDocuments(query);
    return res.json(count);
  } catch (e) {}
  return res.sendStatus(400);
};
