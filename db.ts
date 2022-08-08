import dotenv from "dotenv";
dotenv.config();
const dbPort = 5432;
import pgp from "pg-promise";
const pgpp = pgp({});
const dbConnection = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${dbPort}/${process.env.DB_DATABASE}`;
const db = pgpp(dbConnection);

export default db;
