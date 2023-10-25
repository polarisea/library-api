const api = require("express").Router();
const {
  validLoginByPassword,
  validLoginByFacebook,
  validLoginByGoogle,
  validChangePassword,
  validToken,
} = require("../middlewares/auth");

const {
  register,
  loginByPassword,
  me,
  changePassword,
} = require("../controllers/auth");

api.post("/register", validLoginByPassword, register);
api.post("/login", validLoginByPassword, loginByPassword);
api.post("/login/facebook", validLoginByFacebook, me);
api.post("/login/google", validLoginByGoogle, me);
api.post("/change-password", validToken, validChangePassword, changePassword);

api.get("/me", validToken, me);

module.exports = api;
