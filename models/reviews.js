const db = require("../db/connection");
const {
	fetchPropertyReviewsQuery,
	insertReviewQuery,
	removeReviewQuery,
} = require("./queries");

exports.fetchPropertyReviews = function (id) {
	return db.query(fetchPropertyReviewsQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
		const mean =
			rows.reduce((sum, row) => sum + row.rating, 0) / rows.length;
		const average_rating = Math.round(mean * 10) / 10;
		return { reviews: rows, average_rating };
	});
};

exports.insertReview = function (property_id, review) {
	const { guest_id, rating, comment } = review;
	return db
		.query(insertReviewQuery, [guest_id, property_id, rating, comment])
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.removeReview = function (id) {
	return db.query(removeReviewQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
	});
};
