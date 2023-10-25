const api = require("express").Router();
// const { validPage, validSearch } = require("../middlewares/book.middleware");
const { get, count } = require("../controllers/publisher");

api.get("/", get);
api.get("/count", count);
module.exports = api;
