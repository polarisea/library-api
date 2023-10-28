const api = require("express").Router();
const { validToken } = require("../middlewares/auth");
const {
  validCreate,
  validUpdate,
  validGet,
  validCount,
} = require("../middlewares/contract");

const {
  get,
  count,
  statusCount,
  getContractCountInLast12Months,
  create,
  update,
} = require("../controllers/contract");

api.get("/", validGet, get);
api.get("/count", validCount, count);
api.get("/status-count", statusCount);
api.get("/contract-count-in-last-12-months", getContractCountInLast12Months);

api.post("/", validToken, validCreate, create);

api.patch("/:id/update", validUpdate, update);

module.exports = api;
