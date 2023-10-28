const { Types } = require("mongoose");
const BookModel = require("../models/Book.model");
const UserModel = require("../models/User.model");

const ContractModel = require("../models/Contract");
const { validationResult } = require("express-validator");
const LIMIT = 6;

module.exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { book, from, to, status, indexedContent, user } = req.body;

    const contract = await ContractModel.create({
      user: user || req.user._id,
      book,
      from,
      to,
      status,
      indexedContent,
    });

    await BookModel.findByIdAndUpdate(book, {
      $inc: { contracts: 1, borrowedCount: -1 },
    });
    await UserModel.findByIdAndUpdate(user, { $inc: { contracts: 1 } });
    return res.json(contract);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { id } = req.params;
    const { isFinePaid, returnBookStatus, violationCost, status, returnDate } =
      req.body;
    const data = {};
    data.isFinePaid = isFinePaid;
    returnBookStatus && (data.returnBookStatus = returnBookStatus);
    violationCost && (data.violationCost = violationCost);
    status && (data.status = status);
    returnDate && (data.returnDate = returnDate);

    const updatedContract = await ContractModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    await BookModel.findByIdAndUpdate(updatedContract.book, {
      $inc: { borrowedCount: -1 },
    });
    return res.json(updatedContract);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { page, status, search, book, user } = req.validData;
    const query = {};
    status && (query.status = status);
    search && (query.$text = { $search: search });
    book && (query.book = new Types.ObjectId(book));
    user && (query.user = new Types.ObjectId(user));
    const contracts = await ContractModel.find(query)
      .sort({ createdAt: -1 })
      .skip(page * LIMIT)
      .limit(LIMIT)
      .populate([
        { path: "user", select: "_id, name" },
        { path: "book", select: "_id name damagedBookFine lateReturnFine" },
      ]);

    return res.json(contracts);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { search, user, book, status } = req.validData;
    const query = {};
    user && (query.user = new Types.ObjectId(user));
    book && (query.book = new Types.ObjectId(book));
    status && (query.status = status);
    search && (query.$text = { $search: search });
    const count = await ContractModel.countDocuments(query);
    return res.json(count);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.statusCount = async (req, res) => {
  try {
    const data = await ContractModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    return res.json(data);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.getContractCountInLast12Months = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12); //

    const data = await ContractModel.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }, // Lọc các hợp đồng được tạo sau ngày 12 tháng trước
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // Nhóm theo năm
            month: { $month: "$createdAt" }, // Nhóm theo tháng
          },
          count: { $sum: 1 }, // Đếm số lượng hợp đồng trong mỗi nhóm
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sắp xếp theo thời gian tăng dần
      },
    ]);
    return res.json(data);
  } catch (e) {}
  return res.sendStatus(400);
};
