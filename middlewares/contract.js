const { body, query } = require("express-validator");

const { CONTRACTS } = require("../constants");
const {
  setDefaultQueryValue,
  checkIfExistInBody,
  checkIfExistInQuery,
} = require("../utils/validate");

module.exports.validCreate = [
  body("book").notEmpty(),
  body("from").notEmpty(),
  body("to").notEmpty(),
  body("indexedContent").notEmpty(),
];

module.exports.validUpdate = [
  checkIfExistInBody("isFinePaid", body("isFinePaid").isBoolean()),
  checkIfExistInBody("returnBookStatus", body("returnBookStatus").isIn([0, 1])),
  checkIfExistInBody("status", body("status").isIn(Object.values(CONTRACTS))),
  checkIfExistInBody("returnDate", null),
  checkIfExistInBody("violationCost", body("violationCost").isInt({ min: 0 })),
];

module.exports.validGet = [
  setDefaultQueryValue("search", null, null),
  setDefaultQueryValue("book", null, null),
  setDefaultQueryValue("user", null, null),
  checkIfExistInQuery("page", query("page").isInt({ min: 0 }), 0),
  checkIfExistInQuery(
    "status",
    query("status").isIn(Object.values(CONTRACTS)),
    null
  ),
];

module.exports.validCount = [
  setDefaultQueryValue("search", null, null),
  setDefaultQueryValue("book", null, null),
  setDefaultQueryValue("user", null, null),
  checkIfExistInQuery("page", query("page").isInt({ min: 0 }), 0),
  checkIfExistInQuery(
    "status",
    query("status").isIn(Object.values(CONTRACTS)),
    null
  ),
];
