const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS } = require("../constants");

// sendMail = async () => {
//   const transpoter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: GMAIL_USER,
//       pass: GMAIL_PASS,
//     },
//   });

//   transpoter.sendMail({
//     to: "dtc195480101010001@ictu.edu.vn",
//     subject: "Hello wolrd",
//     text: "My content is nothing",
//   });
// };

// sendMail();
