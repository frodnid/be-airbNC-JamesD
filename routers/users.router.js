const express = require("express");

const { getUser, patchUser } = require("../controllers/users");
const {getUserBookings } = require("../controllers/bookings")
const { handleMethodNotAllowed } = require("../controllers/errors");

const usersRouter = express.Router();

usersRouter
	.route("/:id")
	.get(getUser)
	.patch(patchUser)
	.all(handleMethodNotAllowed);

usersRouter.route("/:id/bookings").get(getUserBookings).all(handleMethodNotAllowed)
module.exports = usersRouter;
