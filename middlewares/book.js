const { body, check, query } = require("express-validator");

const {
  checkIfExistInQuery,
  checkIfExistInBody,
} = require("../utils/validate");

module.exports.validCreateOrUpdate = [
  body("name").notEmpty(),
  body("authors").notEmpty().isArray(),
  body("authors.*").isString(),
  body("categories").notEmpty().isArray(),
  body("categories.*").isString(),
  body("publishers").notEmpty().isArray(),
  body("publishers.*").isString(),
  body("description").notEmpty().isString(),
  body("count").notEmpty().isInt(),
  body("lateReturnFine").notEmpty().isInt({ min: 0 }),
  body("damagedBookFine").notEmpty().isInt({ min: 0 }),
];

module.exports.validGetOrCount = [
  checkIfExistInQuery("search", null, null),
  checkIfExistInQuery("sort", null, "contracts"),
  checkIfExistInQuery("author", null, null),
  checkIfExistInQuery("category", null, null),
  checkIfExistInQuery("publisher", null, null),
  checkIfExistInQuery("page", query("page").isInt({ min: 0 }), 0),
];
