const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
console.log('ENV:', ENV)

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const config = {}

if(ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE (local) or DATABASE_URL not set");
}
const db = new Pool(config);

module.exports = db;