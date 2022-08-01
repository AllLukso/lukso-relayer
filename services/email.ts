const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendUserVerification(email, guid) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("sending email...");
  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: "conner@emeraldtech.org", // sender address
      to: email, // list of receivers
      subject: "Verification ✔", // Subject line
      text: `Please verify with this guid: ${guid}`, // plain text body
      html: `<a href="${process.env.HOST}/v1/user/verify/${guid}">Please verify with this guid: ${guid}</b>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { sendUserVerification };
