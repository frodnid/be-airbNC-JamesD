const db = require("../db/connection");
const { fetchPropertyBookingsQuery, insertBookingQuery } = require("./queries");

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


exports.insertBooking = function(property_id, booking) {
    const { guest_id, check_in_date, check_out_date } = booking;
    return db.query(insertBookingQuery, [guest_id, property_id, check_in_date, check_out_date])
    .then(({ rows }) => rows[0])
}