const { insertFavourite, removeFavourite } = require("../models/favourites");
exports.postFavourite = function (req, res, next) {
	const { guest_id } = req.body;
	const { id: property_id } = req.params;
	insertFavourite(guest_id, property_id)
		.then(({ favourite_id }) => {
			res.status(201).send({
				msg: "Property favourited successfully.",
				favourite_id,
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.deleteFavourite = function (req, res, next) {
	const { id } = req.params;
	removeFavourite(id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};
