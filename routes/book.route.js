const api = require("express").Router();
const { validToken } = require("../middlewares/auth.middleware");
const {
  validPage,
  validSearch,
  validCategory,
  validAuthor,
  validFrom,
  validTo,
  validArrangeTime,
  validUser,
  validBook,
  validName,
  validAuthors,
  validCategories,
  validCount,
  validDescription,
  validCover,
} = require("../middlewares/book.middleware");
const {
  get,
  count,
  setAppointment,
  create,
} = require("../controllers/book.controller");

api.get("/", validPage, validSearch, validCategory, validAuthor, get);
api.post(
  "/",
  validName,
  validAuthors,
  validCategories,
  validCount,
  validCover,
  validDescription,
  create,
);
api.get("/count", validSearch, validCategory, validAuthor, count);
api.post(
  "/request-appointment",
  validToken,
  validArrangeTime,
  validFrom,
  validTo,
  validUser,
  validBook,
  setAppointment,
);

module.exports = api;
