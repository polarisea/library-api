const api = require("express").Router();
const {
  get,
  getUser,
  updateUser,
  count,
  grantPermission,
  deleteUser,
} = require("../controllers/user");

const {
  validGet,
  validUpdateUser,
  validCount,
  validGrantPermission,
} = require("../middlewares/user");

const { validToken, validIsRoot } = require("../middlewares/auth");
const { executeRules } = require("../utils/validate");

api.get("/", validGet, executeRules, get);
api.get("/:id/get", getUser);
api.get("/count", validCount, executeRules, count);

api.patch("/:id/update", validToken, validUpdateUser, executeRules, updateUser);
api.patch(
  "/:id/grant-permission",
  validToken,
  validIsRoot,
  validGrantPermission,
  executeRules,
  grantPermission
);

api.delete("/:id/delete", validToken, validIsRoot, deleteUser);

module.exports = api;
