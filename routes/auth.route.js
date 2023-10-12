const api = require("express").Router();
const { validFbToken, validToken } = require("../middlewares/auth.middleware");
const { login, me } = require("../controllers/auth.controller");

api.get("/login", validFbToken, login);
api.get("/me", validToken, login);
module.exports = api;
