"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nodemailer = require("nodemailer");
require("dotenv").config();
function sendUserVerification(email, guid) {
    return __awaiter(this, void 0, void 0, function* () {
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
            let info = yield transporter.sendMail({
                from: "conner@emeraldtech.org",
                to: email,
                subject: "Verification ✔",
                text: `Please verify with this guid: ${guid}`,
                html: `<a href="${process.env.HOST}/v1/user/verify/${guid}">Please verify with this guid: ${guid}</b>`, // html body
            });
            console.log("Message sent: %s", info.messageId);
        }
        catch (err) {
            console.log(err);
        }
    });
}
module.exports = { sendUserVerification };
//# sourceMappingURL=email.js.map