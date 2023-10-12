const api = require("express").Router();
const {
  validPage,
  validUser,
  validBook,
  validSort,
} = require("../middlewares/contract.middleware");
const { get, count } = require("../controllers/contract.controller");

api.get("/", validPage, validSort, validUser, validBook, get);
api.get("/count", validUser, validBook, count);
module.exports = api;
