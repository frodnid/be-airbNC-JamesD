const express = require("express");

const { getProperties, getProperty } = require("../controllers/properties");
const { postFavourite } = require("../controllers/favourites");
const {
	getPropertyReviews,
	postPropertyReview,
} = require("../controllers/reviews");
const {
	getPropertyBookings,
	postPropertyBooking,
} = require("../controllers/bookings");
const { handleMethodNotAllowed } = require("../controllers/errors");

const propertiesRouter = express.Router();

propertiesRouter.route("/").get(getProperties).all(handleMethodNotAllowed);

propertiesRouter.route("/:id").get(getProperty).all(handleMethodNotAllowed);

propertiesRouter
	.route("/:id/favourite")
	.post(postFavourite)
	.all(handleMethodNotAllowed);

propertiesRouter
	.route("/:id/reviews")
	.get(getPropertyReviews)
	.post(postPropertyReview)
	.all(handleMethodNotAllowed);

propertiesRouter
	.route("/:id/booking")
	.post(postPropertyBooking)
	.all(handleMethodNotAllowed);

propertiesRouter
	.route("/:id/bookings")
	.get(getPropertyBookings)
	.all(handleMethodNotAllowed);

module.exports = propertiesRouter;
