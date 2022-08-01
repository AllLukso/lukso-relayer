require("dotenv").config();
const Queue = require("bull");
const emailService = require("../../services/email");

const userVerificationQueue = new Queue(
  "user-verification",
  process.env.REDIS_URL
);

userVerificationQueue.process(async (job) => {
  const { email, guid } = job.data;
  await emailService.sendUserVerification(email, guid);
});
