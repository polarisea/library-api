const { authors } = require("../cache");

module.exports.get = async (req, res) => {
  return res.json(authors);
};

module.exports.count = async (req, res) => {
  return res.json(authors.length);
};
