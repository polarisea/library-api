const { categories, authors } = require("../cache");

module.exports.get = async (req, res) => {
  return res.json(categories);
};

module.exports.count = async (req, res) => {
  return res.json(categories.length);
};
