const { isInt, isMongoId } = require("validator");
const axios = require("axios");
const { sign, verify } = require("../utils/jwt");
const UserModel = require("../models/User.model");

const sortBy = ["createdAt", "contracts", "votes", "count"];

module.exports.validFbToken = async (req, res, next) => {
  let { fbToken, fbId } = req.query;
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/${fbId}`,
      {
        params: {
          access_token: fbToken,
          fields: "name, picture",
        },
      },
    );
    let user = await UserModel.findOne({ fb: data.id });
    if (!user) {
      user = await UserModel.create({
        fb: data.id,
        name: data.name,
        picture: data.picture.data.url,
      });
    }
    const token = sign({ _id: user._id });
    req.token = token;
    req.user = user;
    return next();
  } catch (error) {
    console.log("Error: ", error.message);
    return res.sendStatus(401);
  }
};

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
