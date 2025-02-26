const express = require("express");

const { getUser, patchUser } = require("../controllers/users");
const { getUserBookings } = require("../controllers/bookings");
const { getUserFavourites } = require("../controllers/favourites");
const { handleMethodNotAllowed } = require("../controllers/errors");

const usersRouter = express.Router();

usersRouter
	.route("/:id")
	.get(getUser)
	.patch(patchUser)
	.all(handleMethodNotAllowed);

usersRouter
	.route("/:id/bookings")
	.get(getUserBookings)
	.all(handleMethodNotAllowed);

usersRouter
	.route("/:id/favourites")
	.get(getUserFavourites)
	.all(handleMethodNotAllowed);
module.exports = usersRouter;
