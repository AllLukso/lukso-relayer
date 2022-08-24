import pgp from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const dbPort = 5432;
const pgpp = pgp({});
const database =
  process.env.NODE_ENV === "test" ? "relayer_test" : process.env.DB_DATABASE;
const dbConnection = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${dbPort}/${database}`;
const db = pgpp(dbConnection);

export default db;
