const express = require("express");
const {
	handlePathNotFound,
	handleMethodNotAllowed,
	handleBadRequest,
	handleForeignKey404,
	handleCustom404,
	handleConflictingRequest,
} = require("./controllers/errors");
const { getProperties, getProperty } = require("./controllers/properties");
const { postFavourite, deleteFavourite } = require("./controllers/favourites");
const {
	getPropertyReviews,
	postPropertyReview,
	deleteReview,
} = require("./controllers/reviews");

const app = express();
app.use(express.json());

app.route("/api/properties")
	.get(getProperties)
	.all(handleMethodNotAllowed);

app.route("/api/properties/:id")
	.get(getProperty)
	.all(handleMethodNotAllowed);

app.route("/api/properties/:id/favourite")
	.post(postFavourite)
	.all(handleMethodNotAllowed);

app.route("/api/properties/:id/reviews")
	.get(getPropertyReviews)
	.post(postPropertyReview)
	.all(handleMethodNotAllowed);

app.route("/api/favourites/:id")
	.delete(deleteFavourite)
	.all(handleMethodNotAllowed);

app.route("/api/reviews/:id")
	.delete(deleteReview)
	.all(handleMethodNotAllowed);

app.use(handleBadRequest);

app.use(handleForeignKey404);

app.use(handleCustom404);

app.use(handleConflictingRequest);

app.all("/*", handlePathNotFound);

module.exports = app;
