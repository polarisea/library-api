const { body, check, query } = require("express-validator");
const { isMongoId, isISODate, isInt } = require("../utils/validate");

const sortBy = ["createdAt", "contracts"];
const { ROLES } = require("../constants");

const {
  setDefaultBodyValue,
  setDefaultQueryValue,
  checkIfExistInBody,
  checkIfExistInQuery,
} = require("../utils/validate");

module.exports.validUpdateUser = [
  checkIfExistInBody("email", body("email").isEmail()),
  checkIfExistInBody("DOB"),
];

module.exports.validGet = [
  checkIfExistInQuery("search", null, null),
  checkIfExistInQuery("sort", null, "contracts"),
  checkIfExistInQuery("role", query("role").isInt({ min: 0 })),
  checkIfExistInQuery("page", query("page").isInt({ min: 0 }), 0),
];

module.exports.validCount = [
  checkIfExistInQuery("search", null, null),
  checkIfExistInQuery("role", query("role").isInt({ min: 0 })),
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
