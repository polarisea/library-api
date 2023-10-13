const api = require("express").Router();
const {
  validLoginByPassword,
  validLoginByFacebook,
  validLoginByGoogle,
  validToken,
} = require("../middlewares/auth");
const { register, loginByPassword, me } = require("../controllers/auth");

api.post("/register", validLoginByPassword, register);

api.post("/login", validLoginByPassword, loginByPassword);
api.post("/login/facebook", validLoginByFacebook, me);
api.post("/login/google", validLoginByGoogle, me);

api.get("/me", validToken, me);
module.exports = api;
