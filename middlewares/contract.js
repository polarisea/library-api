const { body, check, query } = require("express-validator");

const { CONTRACTS } = require("../constants");

module.exports.validCreate = [
  body("book").notEmpty(),
  body("from").notEmpty(),
  body("to").notEmpty(),
  body("indexedContent").notEmpty(),
];

module.exports.validUpdate = [
  body("isFinePaid").custom((value) => {
    if (!value) return true;
    return body("isFinePaid").isBoolean();
  }),
  body("returnBookStatus").custom((value) => {
    if (!value) return true;
    return body("returnBookStatus").isIn([0, 1]);
  }),
  body("status").custom((value) => {
    if (!value) return true;
    return body("status").isIn(Object.values(CONTRACTS));
  }),
  body("returnDate").custom((value) => {
    if (!value) return true;
    return body("returnDate").isISO8601();
  }),
  body("violationCost").custom((value) => {
    if (!value) return true;
    return body("violationCost").isInt({ min: 0 });
  }),
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
  query("status").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.status = null;

      return true;
    }
    req.validData.status = value;
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
  query("book").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.book = null;
      return true;
    }
    req.validData.book = value;
    return true;
  }),
  query("user").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.user = null;
      return true;
    }
    req.validData.user = value;
    return true;
  }),
];

module.exports.validCount = [
  query("status").custom((value, { req }) => {
    req.validData = {};
    if (value == "" || !value) {
      req.validData.status = null;

      return true;
    }
    req.validData.status = value;
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
  query("book").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.book = null;
      return true;
    }
    req.validData.book = value;
    return true;
  }),
  query("user").custom((value, { req }) => {
    if (value == "" || !value) {
      req.validData.user = null;
      return true;
    }
    req.validData.user = value;
    return true;
  }),
];
