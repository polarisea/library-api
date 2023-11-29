const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");

const { GOOGLE_CLIENT_ID } = require("../constants");
const client = new OAuth2Client();

module.exports.checkIfExistInBody = (field, rule, defaultValue) => {
  return (req, res, next) => {
    if (!req.body.hasOwnProperty(field) || req.body[field] === "") {
      if (defaultValue !== undefined) {
        req.body[field] = defaultValue;
      }
      return next();
    }
    if (typeof rule === "function") {
      return rule(req, res, next);
    }
    next();
  };
};

module.exports.checkIfExistInQuery = (field, rule, defaultValue) => {
  return (req, res, next) => {
    if (!req.query.hasOwnProperty(field) || req.query[field] === "") {
      if (defaultValue !== undefined) {
        req.query[field] = defaultValue;
      }

      return next();
    }
    if (typeof rule === "function") {
      return rule(req, res, next);
    }
    next();
  };
};

module.exports.executeRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  next();
};

module.exports.setDefaultQueryValue = (field, defaultValue) => {
  return (req, res, next) => {
    if (!req.query.hasOwnProperty(field) || req.query[field] == "") {
      req.query[field] = defaultValue;
    }
    next();
  };
};

module.exports.setDefaultBodyValue = (field, defaultValue) => {
  return (req, res, next) => {
    if (!req.body.hasOwnProperty(field) || req.body[field] == "") {
      req.body[field] = defaultValue;
    }
    next();
  };
};

module.exports.isMongoId = (str) => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(str);
};

module.exports.isISODate = (str) => {
  const date = new Date(str);
  return date.toISOString() === str;
};

module.exports.isInt = (str) => {
  return /^\d+$/.test(str);
};

module.exports.verifyGoogleCredential = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture } = ticket.getPayload();
    return [sub, email, name, picture];
  } catch (error) {
    return [null, null, null, null];
  }
};

module.exports.verifyFacebookToken = async (fbId, fbToken) => {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/${fbId}`,
      {
        query: {
          access_token: fbToken,
          fields: "name, picture",
        },
      }
    );

    return [data.id, data.name, data.picture.data.url];
  } catch (error) {
    return [null, null, null];
  }
};
