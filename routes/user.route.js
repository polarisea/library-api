const api = require("express").Router();
const { count, get } = require("../controllers/user.controller");

const {
  validSearch,
  validSort,
  validPage,
} = require("../middlewares/user.middleware");

api.get("/", validSort, validSearch, validPage, get);
api.get("/count", validSearch, count);
module.exports = api;
