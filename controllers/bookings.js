const {
	fetchPropertyBookings,
	insertBooking,
	removeBooking,
} = require("../models/bookings");

exports.getPropertyBookings = function (req, res, next) {
	const property_id = Number(req.params.id);
	fetchPropertyBookings(property_id)
		.then((bookings) => {
			res.status(200).send({ bookings, property_id });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postPropertyBooking = function (req, res, next) {
	const { id } = req.params;
	const payload = req.body;
	insertBooking(id, payload)
		.then(({ booking_id }) => {
			res.status(201).send({ msg: "Booking successful", booking_id });
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteBooking = function (req, res, next) {
	const { id } = req.params;
	removeBooking(id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};
