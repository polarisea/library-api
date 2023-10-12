const { Types } = require("mongoose");
const UserModel = require("../models/User.model");

const { PAGE_SIZE } = require("../constants");

module.exports.get = async (req, res) => {
  const { page, search, sort } = req.query;
  const query = {};
  search && (query.$text = { $search: search });
  const books = await UserModel.find(query)
    .sort({ [sort]: -1 })
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return res.json(books);
};

module.exports.count = async (req, res) => {
  const { page, search } = req.query;
  const query = {};
  search && (query.$text = { $search: search });
  const count = await UserModel.countDocuments(query);
  return res.json(count);
};
