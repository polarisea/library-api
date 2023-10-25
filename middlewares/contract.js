const { body, check, query } = require("express-validator");
const { isInt, isMongoId } = require("validator");
const sortBy = ["createdAt"];

module.exports.validCreate = [
  body("user").notEmpty(),
  body("books").notEmpty(),
  body("books").isArray(),
  body("books.*").isObject(),
  body("from").notEmpty(),
  body("to").notEmpty(),
];

module.exports.validUpdate = [
  body("isFinePaid").notEmpty(),
  body("returnBookStatus").notEmpty(),
  body("returnBookStatus").isObject(),
  body("status").notEmpty(),
  body("status").isInt({ min: 0 }),
  body("returnDate").custom((value) => {
    if (!value) return true;
    return body("returnDate").isISO8601();
  }),
  body("violationCost").notEmpty(),
  body("violationCost").isObject(),
];

module.exports.validGet = [
  query("page").custom((value, { req }) => {
    req.validData = {};
    if (!value) {
      req.validData.page = 0;

      return true;
    }
    req.validData.page = parseInt(value) > 0 ? parseInt(value) : 0;
    return true;
  }),
];

module.exports.validPage = (req, res, next) => {
  const { page } = req.query;
  req.query.page = page && isInt(page, { min: 0 }) ? page : 0;
  next();
};

module.exports.validSort = (req, res, next) => {
  const { sort } = req.query;
  req.query.sort = sortBy.includes(sort) ? sort : "createdAt";
  next();
};

module.exports.validUser = (req, res, next) => {
  const { user } = req.query;
  req.query.user = user && isMongoId(user) ? user : false;
  next();
};

module.exports.validBook = (req, res, next) => {
  const { book } = req.query;
  req.query.book = book && isMongoId(book) ? book : false;
  next();
};
