const express = require("express");
const {
	handlePathNotFound,
	handleMethodNotAllowed,
	handleBadRequest,
	handleCustom404,
} = require("./controllers/errors");
const { getProperties } = require("./controllers/properties");
const { postFavourite } = require("./controllers/favourites");
const app = express();
app.use(express.json())

app.route("/api/properties").get(getProperties).all(handleMethodNotAllowed);

app.route("/api/properties/:id/favourite").post(postFavourite);

app.use(handleBadRequest);

app.use(handleCustom404);

app.all("/*", handlePathNotFound);

module.exports = app;
