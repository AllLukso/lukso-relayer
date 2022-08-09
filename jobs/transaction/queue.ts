import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();

export default new Queue("transaction", {
  redis: { port: 6379, host: process.env.REDIS_HOST },
});
