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
    const { user, books, from, to } = req.body;

    const contract = await ContractModel.create({
      user,
      books,
      from,
      to,
      returnBookStatus: books.reduce((t, v) => {
        t[v._id] = v.status;
        return t;
      }, {}),
    });
    for (const bookId of books) {
      const book = await BookModel.findById(bookId);
      if (book.borrowedBook != 0) throw new Error("");
    }
    for (const bookId of books) {
      await BookModel.findByIdAndUpdate(bookId, {
        borrowedBook: 1,
        $inc: { contracts: 1 },
      });
    }
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

    const updatedContract = await ContractModel.findByIdAndUpdate(
      id,
      { isFinePaid, returnBookStatus, violationCost, status, returnDate },
      { new: true }
    );
    for (const bookId in returnBookStatus) {
      await BookModel.findByIdAndUpdate(bookId, { borrowedBook: 0 });
    }
    return res.json(updatedContract);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { page, user, book, sort } = req.validData;
    const query = {};
    // user && (query.user = new Types.ObjectId(user));
    // book && (query.book = new Types.ObjectId(book));
    const contracts = await ContractModel.find(query)
      .skip(page * LIMIT)
      .limit(LIMIT)
      .populate({ path: "user", select: "_id, name" });

    return res.json(contracts);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  const { search, user, book } = req.query;
  const query = {};
  user && (query.user = new Types.ObjectId(user));
  book && (query.book = new Types.ObjectId(book));
  const count = await ContractModel.countDocuments(query);
  return res.json(count);
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
  } catch (e) {
    console.log(e.message);
  }
  return res.sendStatus(400);
};
