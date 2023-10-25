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

api.get("/", validGet, get);
api.get("/:id/get", getUser);
api.get("/count", validCount, count);

api.patch("/:id/update", validToken, validUpdateUser, updateUser);
api.patch(
  "/:id/grant-permission",
  validToken,
  validIsRoot,
  validGrantPermission,
  grantPermission
);

api.delete("/:id/delete", validToken, validIsRoot, deleteUser);

module.exports = api;
