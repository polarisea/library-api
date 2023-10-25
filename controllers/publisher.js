const { publishers } = require("../cache");

module.exports.get = async (req, res) => {
  return res.json(publishers);
};

module.exports.count = async (req, res) => {
  return res.json(publishers.length);
};
