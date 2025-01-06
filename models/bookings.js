const db = require("../db/connection");
const _ = require("lodash");
const {
	fetchPropertyBookingsQuery,
	insertBookingQuery,
	removeBookingQuery,
} = require("./queries");

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

exports.insertBooking = function (property_id, booking) {
	const { guest_id, check_in_date, check_out_date } = booking;
	return db
		.query(insertBookingQuery, [
			guest_id,
			property_id,
			check_in_date,
			check_out_date,
		])
		.then(({ rows }) => rows[0]);
};

exports.removeBooking = function (id) {
	return db.query(removeBookingQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
	});
};

exports.updateBooking = function (id, columns) {
	let columnUpdateString = "SET ";
	for (const column in columns) {
		const value = columns[column];
		columnUpdateString += `${column} = '${value}', `;
	}
	const queryString = `
    UPDATE bookings
    ${columnUpdateString.slice(0, -2)}
    WHERE booking_id = $1
    RETURNING *;`;
	return db.query(queryString, [id]).then(({ rows }) => {
		if (_.isEmpty(rows[0])) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
		return rows[0];
	});
};
