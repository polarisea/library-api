const { isInt, isMongoId } = require("validator");

const sortBy = ["createdAt", "contracts"];

module.exports.validPage = (req, res, next) => {
  const { page } = req.query;
  req.query.page = page && isInt(page, { min: 0 }) ? page : 0;
  next();
};

module.exports.validSort = (req, res, next) => {
  const { sort } = req.query;
  req.query.sort = sortBy.includes(sort) ? sort : "createdAt";
  next();
};

module.exports.validSearch = (req, res, next) => {
  const { search } = req.query;
  req.query.search = search && search.length > 0 ? search : false;
  next();
};
