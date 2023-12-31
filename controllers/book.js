const { Types } = require("mongoose");
const { validationResult } = require("express-validator");

const BookModel = require("../models/Book.model");
const ContractModel = require("../models/Contract");

const { CONTRACTS, PAGE_SIZE, IMAGE_HOST } = require("../constants");
const { addAuthors, addCatgories, addPublishers } = require("../cache");
const {
  convertBase64ToImage,
  formatString,
  getUniqueArray,
} = require("../utils");

module.exports.get = async (req, res) => {
  try {
    const { page, search, sort, category, author, publisher } = req.query;
    const query = {};
    category && (query.categories = category);
    author && (query.authors = author);
    publisher && (query.publishers = publisher);
    search && (query.$text = { $search: search });

    const books = await BookModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "contract",
          localField: "_id",
          foreignField: "book",
          as: "contracts",
        },
      },
      {
        $addFields: {
          contracts: { $size: "$contracts" },
          borrowedCount: {
            $size: {
              $filter: {
                input: "$contracts",
                as: "contract",
                cond: {
                  $or: [
                    { $eq: ["$$contract.status", CONTRACTS.pending] },
                    {
                      $and: [
                        { $eq: ["$$contract.status", CONTRACTS.violation] },
                        { $eq: ["$$contract.returnBookStatus", 0] },
                      ],
                    },
                  ],
                },
              },
            },
          },
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

module.exports.getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await BookModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "contract",
          localField: "_id",
          foreignField: "book",
          as: "contracts",
        },
      },
      {
        $addFields: {
          contracts: { $size: "$contracts" },
          borrowedCount: {
            $size: {
              $filter: {
                input: "$contracts",
                as: "contract",
                cond: {
                  $or: [
                    { $eq: ["$$contract.status", CONTRACTS.pending] },
                    {
                      $and: [
                        { $eq: ["$$contract.status", CONTRACTS.violation] },
                        { $eq: ["$$contract.returnBookStatus", 0] },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!book) return res.sendStatus(400);
    return res.json(book[0]);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  try {
    const { search, category, author, publisher } = req.query;
    const query = {};
    category && (query.categories = category);
    author && (query.authors = author);
    publisher && (query.publishers = publisher);
    search && (query.$text = { $search: search });
    const count = await BookModel.countDocuments(query);
    return res.json(count);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.createOrUpdate = async (req, res) => {
  try {
    const {
      name,
      authors,
      categories,
      publishers,
      description,
      cover,
      count,
      lateReturnFine,
      damagedBookFine,
    } = req.body;
    const { id } = req.params;
    const nAuthors = getUniqueArray(authors.map((a) => formatString(a)));
    const nCatgories = getUniqueArray(categories.map((c) => formatString(c)));
    const nPublishers = getUniqueArray(publishers.map((p) => formatString(p)));

    const data = {
      name,
      authors: nAuthors,
      categories: nCatgories,
      publishers: nPublishers,
      indexedContent:
        name + " " + [...nAuthors, ...nCatgories, ...nPublishers].join(" "),
      description,
      count,
      lateReturnFine,
      damagedBookFine,
    };

    if (cover) {
      const fileName = `${Date.now()}.jpg`;
      convertBase64ToImage(cover, `public/covers/${fileName}`);
      data["cover"] = `${IMAGE_HOST}/${fileName}`;
    }
    if (id) {
      const updatedBook = await BookModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return res.json(updatedBook);
    }
    const book = await BookModel.create(data);
    addAuthors(nAuthors);
    addCatgories(nCatgories);
    addPublishers(nPublishers);
    return res.json(book);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.statusCount = async (req, res) => {
  try {
    const data = await BookModel.aggregate([
      {
        $lookup: {
          from: "contract",
          localField: "_id",
          foreignField: "book",
          as: "contracts",
        },
      },
      {
        $addFields: {
          brokenCount: {
            $size: {
              $filter: {
                input: "$contracts",
                as: "contract",
                cond: { $eq: ["$$contract.returnBookStatus", 1] },
              },
            },
          },
          borrowedCount: {
            $size: {
              $filter: {
                input: "$contracts",
                as: "contract",
                cond: {
                  $or: [
                    { $eq: ["$$contract.status", CONTRACTS.pending] },
                    {
                      $and: [
                        { $eq: ["$$contract.status", CONTRACTS.violation] },
                        { $eq: ["$$contract.returnBookStatus", 0] },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: "$count" },
          totalBrokenCount: { $sum: "$brokenCount" },
          totalBorrowedCount: { $sum: "$borrowedCount" },
        },
      },
    ]);
    data[0].totalStockCount = data[0].totalCount - data[0].totalBorrowedCount;
    return res.json(data[0]);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.bookInCategoryCount = async (req, res) => {
  try {
    const data = await BookModel.aggregate([
      {
        $unwind: "$categories", // Tách mảng categories thành các documents riêng lẻ
      },
      {
        $group: {
          _id: "$categories", // Gom nhóm các documents theo categories
          count: { $sum: 1 }, // Tính tổng số lượng sách trong từng danh mục
        },
      },
    ]);
    return res.json(data);
  } catch (e) {}
  return res.sendStatus(400);
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await BookModel.findByIdAndRemove(id);
    if (deleted) return res.json(id);
  } catch (error) {}
  return res.sendStatus(400);
};
