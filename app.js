const express = require("express");
const {
	handlePathNotFound,
	handleMethodNotAllowed,
	handleBadRequest,
	handleCustom404,
} = require("./controllers/errors");
const app = express();

const { getProperties } = require("./controllers/properties");

app.route("/api/properties").get(getProperties).all(handleMethodNotAllowed);
app.use(handleBadRequest);
app.use(handleCustom404);
app.all("/*", handlePathNotFound);

module.exports = app;
