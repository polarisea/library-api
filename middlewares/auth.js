const { body } = require("express-validator");

const { ROLES } = require("../constants");
const { verify } = require("../utils/cryption");
const {
  verifyGoogleCredential,
  verifyFacebookToken,
} = require("../utils/validate");

const UserModel = require("../models/User.model");

module.exports.validLoginByPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email không được trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password")
    .notEmpty()
    .withMessage("password không được trống")
    .isLength({ min: 6, max: 18 })
    .withMessage("Mật khẩu không hợp lệ"),
];

module.exports.validLoginByGoogle = [
  body("credential")
    .notEmpty()
    .withMessage("credential không được trống")
    .custom(async (value, { req }) => {
      const [google, email, name, picture] = await verifyGoogleCredential(
        value,
      );
      if (!google) throw new Error("credential không hợp lệ");
      let user = await UserModel.findOne({ google });
      if (!user) {
        user = await UserModel.create({
          google,
          email,
          name,
          picture,
        });
      }
      req.user = user;
    }),
];

module.exports.validLoginByFacebook = [
  body("fbId").notEmpty().withMessage("fbId không được bỏ trống"),
  body("accessToken")
    .notEmpty()
    .withMessage("accessToken không được bỏ trống")
    .custom(async (value, { req }) => {
      console.log(req.body);
      const [fb, name, picture] = await verifyFacebookToken(
        req.body.fbId,
        value,
      );
      if (!fb) throw new Error("accessToken không hợp lệ");
      let user = await UserModel.findOne({ fb });
      if (!user) {
        user = await UserModel.create({
          fb,
          name,
          picture,
        });
      }
      req.user = user;
    }),
];

module.exports.validToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const [bearer, token] = authHeader.split(" ");

  if (bearer != "Bearer" || !token) return res.sendStatus(401);
  const decoded = verify(token);
  if (!decoded) return res.sendStatus(401);
  const { _id } = decoded;
  const user = await UserModel.findById(_id);
  req.user = user;
  next();
};

module.exports.validIsRoot = (req, res, next) => {
  const user = req.user;
  if (!user || user.role > ROLES.root.value)
    return res.status(401).json("Bạn không được cấp phép");
  next();
};

module.exports.validIsAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || user.role > ROLES.admin.value)
    return res.status(401).json("Bạn không được cấp phép");
  next();
};
