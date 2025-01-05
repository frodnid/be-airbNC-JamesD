const { fetchPropertyBookings } = require("../models/bookings");

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
