# AirBNC

## **Intro**
This is the backend portion of a portfolio project for the Northcoders part time software development course created by James Dindorf.<br>
The project is an AirBnB-like app using express and PostgreSQL for backend, developed with TDD using jest and supertest.
## **Setup & Seed Commands**
**Initialise database**: `npm run setup-db`<br>
**Seed database**: `npm run seed`<br>
## **Using this Repo**
Connection.js uses jest's automatic `NODE_ENV` variable to access PG credentials in a `.env.test` file.<br>
Create this file in your local directory and add the following credentials to access the requisite database functions:<br>
`PGDATABASE=airbnc_test`

