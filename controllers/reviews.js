const { fetchPropertyReviews, insertReview } = require("../models/reviews");

exports.getPropertyReviews = function (req, res, next) {
	const { id } = req.params;
	fetchPropertyReviews(id)
		.then((reviewData) => {
			res.status(200).send(reviewData);
		})
		.catch((err) => {
			next(err);
		});
};

exports.postPropertyReview = function (req, res, next) {
	const { id } = req.params;
	const payload = req.body;
	insertReview(id, payload)
		.then((review) => {
			res.status(201).send({ review });
		})
		.catch((err) => {
			next(err);
		});
};
