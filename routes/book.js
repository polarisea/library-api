const api = require("express").Router();
const { validToken, validIsAdmin } = require("../middlewares/auth");
const { validCreateOrUpdate, validGetOrCount } = require("../middlewares/book");
const {
  get,
  count,
  statusCount,
  borrowedBookCount,
  bookInCategoryCount,
  createOrUpdate,
  deleteBook,
  getBook,
} = require("../controllers/book");

const { executeRules } = require("../utils/validate");

api.get("/", validGetOrCount, executeRules, get);
api.get("/:id/get", getBook);
api.get("/status-count", statusCount);
// api.get("/borrowed-book-count", borrowedBookCount);
api.get("/book-in-category-count", bookInCategoryCount);
api.get("/count", validGetOrCount, executeRules, count);

api.post(
  "/",
  validToken,
  validIsAdmin,
  validCreateOrUpdate,
  executeRules,
  createOrUpdate
);

api.patch(
  "/:id/update",
  validToken,
  validIsAdmin,
  validCreateOrUpdate,
  executeRules,
  createOrUpdate
);

api.delete("/:id/delete", validToken, validIsAdmin, deleteBook);

module.exports = api;
