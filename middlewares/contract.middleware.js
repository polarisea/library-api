const { isInt, isMongoId } = require("validator");

const sortBy = ["createdAt"];

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
