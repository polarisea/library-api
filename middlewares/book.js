const { body, check, query } = require("express-validator");
const { isInt, isMongoId } = require("validator");

const { isISODate } = require("../utils/validate");
const BookModel = require("../models/Book.model");
const sortBy = ["createdAt", "contracts", "votes", "count"];

module.exports.validCreateOrUpdate = [
  body("name").notEmpty(),
  body("authors").notEmpty(),
  body("authors").isArray(),
  body("authors.*").isString(),
  body("categories").notEmpty(),
  body("categories").isArray(),
  body("categories.*").isString(),
  body("publishers").notEmpty(),
  body("publishers").isArray(),
  body("publishers.*").isString(),
  body("description").notEmpty(),
  body("description").isString(),
  body("status").notEmpty(),
  body("status").isInt(),
  body("lateReturnFine").notEmpty(),
  body("lateReturnFine").isInt({ min: 0 }),
  body("damagedBookFine").notEmpty(),
  body("damagedBookFine").isInt({ min: 0 }),
  body("cover").custom((value) => {
    if (!value) {
      return true;
    }
    return body("cover").isString();
  }),
];

module.exports.validGetOrCount = [
  query("page").custom((value, { req }) => {
    req.validData = {};
    if (!value) {
      req.validData.page = 0;

      return true;
    }
    req.validData.page = parseInt(value) > 0 ? parseInt(value) : 0;
    return true;
  }),
  query("search").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.search = null;

      return true;
    }
    req.validData.search = value;
    return true;
  }),
  query("sort").custom((value, { req }) => {
    if (!value) {
      req.validData.sort = "contracts";
      return true;
    }
    req.validData.sort = value;
    return true;
  }),
  query("author").custom((value, { req }) => {
    req.validData.author = value;
    return true;
  }),
  query("category").custom((value, { req }) => {
    req.validData.category = value;
    return true;
  }),
  query("publisher").custom((value, { req }) => {
    req.validData.publisher = value;
    return true;
  }),
];

module.exports.validPage = (req, res, next) => {
  const { page } = req.query;
  req.query.page = page && isInt(page, { min: 0 }) ? page : 0;
  next();
};

module.exports.validSearch = (req, res, next) => {
  const { search } = req.query;
  req.query.search = search && search.length > 0 ? search : false;
  next();
};

module.exports.validSort = (req, res, next) => {
  const { sort } = req.query;
  req.query.sort = sortBy.includes(sort) ? sort : "createdAt";
  next();
};

module.exports.validAuthor = (req, res, next) => {
  const { author } = req.query;
  req.query.author = author && isMongoId(author) ? author : false;
  next();
};

module.exports.validCategory = (req, res, next) => {
  const { category } = req.query;
  req.query.category = category && isMongoId(category) ? category : false;
  next();
};

module.exports.validFrom = (req, res, next) => {
  const { from } = req.body;
  if (!(from && isISODate(from))) return res.sendStatus(400);
  next();
};

module.exports.validTo = (req, res, next) => {
  const { to } = req.body;
  if (!(to && isISODate(to))) return res.sendStatus(400);
  next();
};

module.exports.validArrangeTime = (req, res, next) => {
  const { from, to } = req.body;
  if (from > to) return res.sendStatus(400);
  next();
};

module.exports.validUser = (req, res, next) => {
  const { _id } = req.user;
  req.body.user = _id;
  next();
};

module.exports.validBook = async (req, res, next) => {
  const { book: bookId } = req.body;
  if (!(bookId && isMongoId(bookId))) return res.sendStatus(400);
  const book = await BookModel.findById(bookId);
  if (!book) return res.sendStatus(400);
  req.body.book = bookId;
  next();
};

module.exports.validName = (req, res, next) => {
  const { name } = req.body;
  if (!(name && name.length > 0)) return res.sendStatus(400);
  next();
};

module.exports.validAuthors = (req, res, next) => {
  const { authors } = req.body;
  if (!(authors && Array.isArray(authors))) return res.sendStatus(400);
  if (!authors.every((id) => isMongoId(id))) return res.sendStatus(400);
  next();
};

module.exports.validCategories = (req, res, next) => {
  const { categories } = req.body;
  if (!(categories && Array.isArray(categories))) return res.sendStatus(400);
  if (!categories.every((id) => isMongoId(id))) return res.sendStatus(400);
  next();
};

module.exports.validCount = (req, res, next) => {
  const { count } = req.body;
  if (!(count && isInt(`${count}`, { min: 1 }))) return res.sendStatus(400);
  next();
};

module.exports.validDescription = (req, res, next) => {
  const { description } = req.body;
  if (!(description && description.length > 0)) return res.sendStatus(400);
  next();
};

module.exports.validCover = (req, res, next) => {
  const { cover } = req.body;
  req.body.cover = cover && cover.length > 0 ? cover : null;
  next();
};
