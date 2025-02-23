const express = require("express");
const cors = require("cors");
const {
	handlePathNotFound,
	handleBadRequest,
	handleForeignKey404,
	handleCustom404,
	handleConstraints,
	handleExceptions
} = require("./controllers/errors");

const apiRouter = require("./routers/api.router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleBadRequest);

app.use(handleForeignKey404);

app.use(handleCustom404);

app.use(handleConstraints);

app.use(handleExceptions);

app.all("/*", handlePathNotFound);

module.exports = app;
