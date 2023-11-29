const api = require("express").Router();
const { validToken, validIsAdmin } = require("../middlewares/auth");

const { get, count, create, deleteNotify } = require("../controllers/notify");

api.get("/", get);
api.post("/", validToken, validIsAdmin, create);
api.delete("/:id/delete", validToken, validIsAdmin, deleteNotify);
api.get("/count", count);

module.exports = api;
