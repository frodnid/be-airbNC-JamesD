const express = require("express");
const {
	handlePathNotFound,
	handleBadRequest,
	handleForeignKey404,
	handleCustom404,
	handleConflictingRequest,
} = require("./controllers/errors");

const apiRouter = require("./routers/api.router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleBadRequest);

app.use(handleForeignKey404);

app.use(handleCustom404);

app.use(handleConflictingRequest);

app.all("/*", handlePathNotFound);

module.exports = app;
