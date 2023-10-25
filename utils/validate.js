const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID } = require("../constants");
const client = new OAuth2Client();

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
        params: {
          access_token: fbToken,
          fields: "name, picture",
        },
      },
    );

    return [data.id, data.name, data.picture.data.url];
  } catch (error) {
    return [null, null, null];
  }
};
