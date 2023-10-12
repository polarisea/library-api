const { Types } = require("mongoose");
const BookModel = require("../models/Book.model");
const ContractModel = require("../models/Contract.model");

const LIMIT = 2;

module.exports.get = async (req, res) => {
  const { page, user, book, sort } = req.query;
  const query = {};
  user && (query.user = new Types.ObjectId(user));
  book && (query.book = new Types.ObjectId(book));
  const contracts = await ContractModel.find(query)
    .sort({ [sort]: -1 })
    .skip(page * LIMIT)
    .limit(LIMIT)
    .populate([
      { path: "user", select: "_id name picture" },
      { path: "book", select: "_id name cover" },
    ]);

  return res.json(contracts);
};

module.exports.count = async (req, res) => {
  const { search, user, book } = req.query;
  const query = {};
  user && (query.user = new Types.ObjectId(user));
  book && (query.book = new Types.ObjectId(book));
  const count = await ContractModel.countDocuments(query);
  return res.json(count);
};
