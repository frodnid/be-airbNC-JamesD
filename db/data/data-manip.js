const db = require("../connection");
const { createRef } = require("./utils");

exports.createUserIDRef = function () {
	return db
		.query(
			`
        SELECT first_name || ' ' || surname AS full_name,
        user_id 
        FROM users;`
		)
		.then(({ rows }) => {
			return createRef("full_name", "user_id", rows);
		});
};

exports.createPropertyIDRef = function () {
	return db
		.query(
			`
        SELECT name,
        property_id
        FROM properties;`
		)
		.then(({ rows }) => {
			return createRef("name", "property_id", rows);
		});
};
