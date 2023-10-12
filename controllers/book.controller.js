const { Types } = require("mongoose");
const BookModel = require("../models/Book.model");
const ContractModel = require("../models/Contract.model");

const { CONTRACT_TYPES, PAGE_SIZE, IMAGE_HOST } = require("../constants");
const { convertBase64ToImage } = require("../utils");

module.exports.get = async (req, res) => {
  const { page, search, sort, category, author } = req.query;
  const query = {};
  category && (query.categories = new Types.ObjectId(category));
  author && (query.authors = new Types.ObjectId(author));
  search && (query.$text = { $search: search });
  const books = await BookModel.find(query)
    .sort({ [sort]: -1 })
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .populate(["categories", "authors"]);

  return res.json(books);
};

module.exports.count = async (req, res) => {
  const { search, category, author } = req.query;
  const query = {};
  category && (query.categories = new Types.ObjectId(category));
  author && (query.authors = new Types.ObjectId(author));

  search && (query.$text = { $search: search });
  const count = await BookModel.countDocuments(query);
  return res.json(count);
};

module.exports.setAppointment = async (req, res) => {
  const { from, to, user, book } = req.body;
  const contract = await ContractModel.create({
    user,
    book,
    from,
    to,
    status: CONTRACT_TYPES.requesting,
  });
  return res.status(201).json(contract);
};

module.exports.create = async (req, res) => {
  const { name, authors, categories, count, description, cover } = req.body;
  const data = {
    name,
    authors,
    categories,
    count,
    description,
  };
  if (cover) {
    const fileName = `${Date.now()}.jpg`;
    convertBase64ToImage(cover, `public/covers/${fileName}`);
    data["cover"] = `${IMAGE_HOST}/${fileName}`;
  }
  const book = await BookModel.create(data);

  return res.json(book);
};
