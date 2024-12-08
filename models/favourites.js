const db = require("../db/connection");
const { insertFavouriteQuery, removeFavouriteQuery } = require("./queries");

exports.insertFavourite = function (guest_id, property_id) {
	return db
		.query(insertFavouriteQuery, [guest_id, property_id])
		.then(({ rows }) => rows[0]);
};

exports.removeFavourite = function (id) {
	return db.query(removeFavouriteQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
	});
};
