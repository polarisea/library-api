const { body, check, query } = require("express-validator");
const { isMongoId, isISODate, isInt } = require("../utils/validate");

const sortBy = ["createdAt", "contracts"];
const { ROLES } = require("../constants");

module.exports.validUpdateUser = [
  body("email").custom((value) => {
    if (value == null || value == undefined) return true;
    return body("email").isEmail().withMessage("Email không hợp lệ");
  }),
  body("DOB").custom((value) => {
    if (value == null || value == undefined) return true;
    if (!isISODate(value)) throw new Error("DOB không hợp lệ");
    return true;
  }),
];

module.exports.validGet = [
  query("page").custom((value, { req }) => {
    req.validData = {};
    if (!isInt(value)) {
      req.validData.page = 0;

      return true;
    }
    req.validData.page = parseInt(value) > 0 ? parseInt(value) : 0;
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

  query("search").custom((value, { req }) => {
    req.validData.search = value && value.length > 0 ? value : false;
    return true;
  }),

  query("role").custom((value, { req }) => {
    req.validData.role = value ? value : false;
    return true;
  }),
];

module.exports.validCount = [
  query("search").custom((value, { req }) => {
    req.validData = {};
    req.validData.search = value && value.length > 0 ? value : false;
    return true;
  }),
  query("role").custom((value, { req }) => {
    req.validData.role = value ? value : false;
    return true;
  }),
];

module.exports.validGrantPermission = [
  check("id").notEmpty(),
  body("role")
    .notEmpty()
    .custom((value) => {
      if (value != ROLES.admin.value && value != ROLES.user.value)
        throw new Error("Role is invalid");

      return true;
    }),
];
