const db = require("../db/connection");
const _ = require("lodash");
const { fetchUserQuery, updateUserQuery } = require("./queries");

exports.fetchUser = function (id) {
	return db.query(fetchUserQuery, [id]).then(({ rows }) => {
		if (_.isEmpty(rows[0])) {
			return Promise.reject({
				status: 404,
				msg: "ID not found.",
			});
		}
		return rows[0];
	});
};

exports.updateUser = function (id, columns) {
	let columnUpdateString = "SET ";
	for (const column in columns) {
		const value = columns[column];
		if (column === "phone") {
			columnUpdateString += `phone_number = '${value}', `;
		} else {
			columnUpdateString += `${column} = '${value}', `;
		}
	}
	const queryString = `
    UPDATE users
    ${columnUpdateString.slice(0, -2)}
    WHERE user_id = $1
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
