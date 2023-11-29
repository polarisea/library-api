const { Types } = require("mongoose");
const BookModel = require("../models/Book.model");
const UserModel = require("../models/User.model");
const NotifyModel = require("../models/Notify.model");

const ContractModel = require("../models/Contract");
const { CONTRACTS } = require("../constants");
const LIMIT = 6;
const { vnDate } = require("../utils/date");

module.exports.create = async (req, res) => {
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

    const contract = await ContractModel.findById(id).populate({
      path: "book",
      select: "name",
    });

    const updatedContract = await ContractModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    await BookModel.findByIdAndUpdate(updatedContract.book, {
      $inc: { borrowedCount: -1 },
    });

    if (
      status == CONTRACTS.pending &&
      contract.status == CONTRACTS.requesting
    ) {
      const notify = await NotifyModel.create({
        receiver: contract.user,
        title: "Chấp thuận yêu cầu mượn sách.",
        content: `Yêu cầu mượn sách "${contract.book.name}" từ ngày ${vnDate(
          contract.from
        )} đến ${vnDate(contract.to)} của bạn được chấp thuận.`,
      });
    }
    if (
      status == CONTRACTS.violation &&
      contract.status != CONTRACTS.violation
    ) {
      const notify = await NotifyModel.create({
        receiver: contract.user,
        title: "Thông báo vi phạm.",
        content: `Yêu cầu mượn sách "${contract.book.name}" từ ngày ${vnDate(
          contract.from
        )} đến ${vnDate(
          contract.to
        )} của bạn đã vi phạm. Đề nghị bạn nộp phạt ${violationCost}đ.`,
      });
    }

    return res.json(updatedContract);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.get = async (req, res) => {
  try {
    const { page, status, search, book, user } = req.query;
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
  try {
    const { search, user, book, status } = req.query;
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

module.exports.cancel = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const deleted = await ContractModel.findOneAndDelete({
      _id: id,
      user: user._id,
    });
    if (deleted) return res.json(id);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.refuse = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await ContractModel.findById(id).populate({
      path: "book",
      select: "name",
    });
    const deleted = await ContractModel.findByIdAndDelete(id);
    console.log(id);
    console.log(deleted);

    if (deleted) {
      const notify = await NotifyModel.create({
        receiver: contract.user,
        title: "Từ chối yêu cầu mượn sách.",
        content: `Yêu cầu mượn sách "${contract.book.name}" từ ngày ${vnDate(
          contract.from
        )} đến ${vnDate(contract.to)} của bạn không được chấp thuận.`,
      });
      console.log(notify);
      return res.json(id);
    }
  } catch (error) {
    console.log(error.message);
  }
  return res.sendStatus(400);
};
