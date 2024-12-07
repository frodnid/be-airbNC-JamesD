const express = require("express");
const {
	handlePathNotFound,
	handleMethodNotAllowed,
	handleBadRequest,
	handleCustom404,
    handleConflictingRequest
} = require("./controllers/errors");
const { getProperties } = require("./controllers/properties");
const { postFavourite } = require("./controllers/favourites");
const app = express();
app.use(express.json())

app.route("/api/properties").get(getProperties).all(handleMethodNotAllowed);

app.route("/api/properties/:id/favourite").post(postFavourite).all(handleMethodNotAllowed);

app.use(handleBadRequest);

app.use(handleCustom404);

app.use(handleConflictingRequest);

app.all("/*", handlePathNotFound);

module.exports = app;
