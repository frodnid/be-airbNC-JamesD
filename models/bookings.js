const db = require("../db/connection");
const { fetchPropertyBookingsQuery } = require("./queries");

exports.fetchPropertyBookings = function (id) {
	return db.query(fetchPropertyBookingsQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
		return rows;
	});
};
