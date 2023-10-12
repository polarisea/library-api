require("dotenv").config();

module.exports.PORT = process.env.PORT || 3000;
module.exports.MONGODB_URL = process.env.MONGODB_URL;
module.exports.PAGE_SIZE = 6;

module.exports.CONTRACT_TYPES = {
  requesting: 0,
  acepted: 1,
  pending: 2,
  violation: 3,
  finished: 4,
};

module.exports.VOTING_VALUES = [-1, -0.5, 0, 0.5, 1];

module.exports.IMAGE_HOST = `https://localhost:3000/covers`;
