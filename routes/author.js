const api = require("express").Router();
const { get, count } = require("../controllers/author");

api.get("/", get);
api.get("/count", count);
module.exports = api;
