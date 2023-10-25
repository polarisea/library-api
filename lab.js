const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID } = require("./constants");
const client = new OAuth2Client();
const { faker } = require("@faker-js/faker");
const { setShedule } = require("./schedule");

// Mỗi ngày vào mỗi 0 giờ (00:00)

const {
  categoryFactory,
  authorFactory,
  bookFactory,
  contractFactory,
  voteFactory,
  userFactory,
  publisherFactory,
} = require("./faker/seed");

async function verify() {
  const ticket = await client.verifyIdToken({
    idToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2MjYzZDA5NzQ1YjUwMzJlNTdmYTZlMWQwNDFiNzdhNTQwNjZkYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2Mzc3OTA4NTYwMTItOXZtaXJobG5iMzAzcHNkamJsaW8wY2U0ZWlrOTZhZG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2Mzc3OTA4NTYwMTItOXZtaXJobG5iMzAzcHNkamJsaW8wY2U0ZWlrOTZhZG4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgyNjI2MjQ3ODQ5MjU4ODI3MTEiLCJlbWFpbCI6ImNvdGVuazdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5NzE5ODI0OSwibmFtZSI6IsSQw6xuaCBExaluZyBWxakiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1BXd191aVR1N1BxSmQ0RU40a3BhazVQN04tUXJCNjRTTE1BTzZOcnc9czk2LWMiLCJnaXZlbl9uYW1lIjoixJDDrG5oIETFqW5nIiwiZmFtaWx5X25hbWUiOiJWxakiLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTY5NzE5ODU0OSwiZXhwIjoxNjk3MjAyMTQ5LCJqdGkiOiJhY2MzMTdiNmVkOTVhMTQyMjAwY2Y4NDhjYTAxOWM4OGI2YzI5ZWJjIn0.mlt4krK4Xzjtjg6z6LkiGTnebeJhocu5wnbvtA98VVvq_HXhyQ-p-vzLNAXgSi5EAGqrGkpaiSTPupsk6fH6UtMwJI8Qa8HqbuxqoVuvieQKQAOnpSwB1j4UPjXIe_TInupF-rKERDMXZQYEoEBXEsbU3qWQtVj8INaTCXq1hko4pb7uOimMvEf5qsuPhkZOd3qi2TCZiZrOJxs4LBdA9MWjU-XlxFREQdqJvUVsN60oN3OUXp3CcySj71jS1wrmuVtp0d3C3fX9ZDs6QMjQHmciWpNjVGFoDKzj3bV9Y0SwQ5VewH5ovZhXYfc5vp_KngaYZfU-ycMO8Wg4MM6PKQ",
    audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  //   const payload = ticket.getPayload();
  const { sub } = ticket.getPayload();

  //   const userid = payload["sub"];
  console.log(sub);
}
// verify().catch(console.error);

async function verifyFacebookToken(fbId, fbToken) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/${fbId}`,
      {
        params: {
          access_token: fbToken,
          fields: "name, picture",
        },
      }
    );
    console.log(data);
    return [data.id, data.name, data.picture.data.url];
  } catch (error) {
    console.log(error.message);
  }
}

// verifyFacebookToken(
//   "1957682674606990",
//   "EAAaCFYxVou0BO29JafxNhZAD8PHOUyLZCTcVV3b9t3GamTChEoZAIolYwpxcyIHFHeXo6CN3ZAbPbadN4aqGkhut58WIKSzLVevcGj9ZCEAzwbDmfQ0IiDoxdxYb3ymbiJ68JFrFeVw8nRAOoUqIrOt2PYU3ZBy4RqIT2QHYnlHHeZAaDKzFF8UqyaZAtZBZByMZBq0yvfqpQG0jozgP3EBVOFpwM9cQfgZD",
// );

function migrate() {
  const authors = authorFactory(10);

  const categories = categoryFactory(15);

  const publishers = publisherFactory(15);

  const books = bookFactory(100, authors, categories, publishers);

  const users = userFactory(100);

  const contracts = contractFactory(100, books, users);
  console.log(contracts);
}

function getRandomDateWithinLast12Months() {
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const randomTimestamp = faker.date
    .between({ from: twelveMonthsAgo, to: now })
    .getTime();
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

setShedule();
