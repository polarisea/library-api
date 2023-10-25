require("dotenv").config();

module.exports.PORT = process.env.PORT || 3000;
module.exports.MONGODB_URL = process.env.MONGODB_URL;
module.exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
module.exports.JWT_SCERET_KEY = process.env.JWT_SCERET_KEY || "fdajlkfjal";
module.exports.BCRYPT_SALT_ROUNDS = parseInt(
  process.env.BCRYPT_SALT_ROUNDS || 4
);

module.exports.ROLES = {
  root: {
    value: 0,
  },
  admin: {
    value: 1,
  },
  user: {
    value: 100,
  },
};

module.exports.PAGE_SIZE = 6;

module.exports.CONTRACT_TYPES = {
  pending: 0,
  violation: 1,
  finished: 2,
};

module.exports.VOTING_VALUES = [-1, -0.5, 0, 0.5, 1];

module.exports.IMAGE_HOST = `https://localhost:3000/covers`;

module.exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

module.exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
