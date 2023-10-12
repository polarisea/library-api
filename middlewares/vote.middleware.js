const { isInt, isMongoId } = require("validator");
const BookModel = require("../models/Book.model");
const { VOTING_VALUES } = require("../constants");

module.exports.validValue = (req, res, next) => {
  const { value } = req.body;
  console.log("Value: ", req.body, !VOTING_VALUES.includes(value));
  if (!VOTING_VALUES.includes(value)) return res.sendStatus(400);
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
