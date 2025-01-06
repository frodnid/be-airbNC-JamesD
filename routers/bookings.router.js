const express = require("express");

const { deleteBooking, patchBooking } = require("../controllers/bookings");
const { handleMethodNotAllowed } = require("../controllers/errors");

const bookingsRouter = express.Router();

bookingsRouter
	.route("/:id")
	.patch(patchBooking)
	.delete(deleteBooking)
	.all(handleMethodNotAllowed);

module.exports = bookingsRouter;
