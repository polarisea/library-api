const api = require("express").Router();
// const { validPage, validSearch } = require("../middlewares/book.middleware");
const { get, count } = require("../controllers/category.controller");

api.get("/", get);
api.get("/count", count)
module.exports = api;
