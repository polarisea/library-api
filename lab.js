const { body, query } = require("express-validator");

// const { CONTRACTS } = require("../constants");
// const { setDefaultBodyValue } = require("../utils/validate");
const next = (e) => {
  console.log(e);
};
console.log(body("book").notEmpty()({}, {}, next));
