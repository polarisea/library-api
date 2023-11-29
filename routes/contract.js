const api = require("express").Router();
const { validToken, validIsAdmin } = require("../middlewares/auth");
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
  cancel,
  refuse,
} = require("../controllers/contract");

const { executeRules } = require("../utils/validate");

api.get("/", validGet, executeRules, get);
api.get("/count", validCount, executeRules, count);
api.get("/status-count", statusCount);
api.get("/contract-count-in-last-12-months", getContractCountInLast12Months);

api.post("/", validToken, validCreate, executeRules, create);

api.patch(
  "/:id/update",
  validToken,
  validIsAdmin,
  validUpdate,
  executeRules,
  update
);

api.delete("/:id/refuse", validToken, validIsAdmin, refuse);
api.delete("/:id/cancel", validToken, cancel);

module.exports = api;
