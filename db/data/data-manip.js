const db = require("../connection");
const { createIDRef } = require("./utils");

exports.createUserIDRef = function () {
	return db
		.query(
			`
        SELECT first_name || ' ' || surname AS full_name,
        user_id 
        FROM users;`
		)
		.then(({ rows }) => {
			return createIDRef("full_name", "user_id", rows);
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
			return createIDRef("name", "property_id", rows);
		});
};
