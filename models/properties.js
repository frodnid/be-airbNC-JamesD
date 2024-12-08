const db = require("../db/connection");
const format = require("pg-format");
const _ = require("lodash");
const queryFormat = function (query, ...args) {
	return db.query(format(query, ...args));
};
const {
	fetchPropertiesQuery,
	fetchPropertyQueryStart,
	fetchPropertyQueryEnd,
} = require("./queries");

exports.fetchProperties = function (queries) {
	if (!queries) {
		return db.query(fetchPropertiesQuery).then(({ rows }) => rows);
	}

	const {
		maxprice = 9999,
		minprice = 0,
		sort = "popularity",
		order = "asc",
		host,
	} = queries;

	if (!host) {
		const whereClause = `price_per_night <= %L AND price_per_night >= %L`;
		const parametricQuery = `WHERE (${whereClause}) ORDER BY %I %s;`;
		return queryFormat(
			`${fetchPropertiesQuery}${parametricQuery};`,
			maxprice,
			minprice,
			sort,
			order
		).then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "No properties in price range.",
				});
			}
			return rows;
		});
	} else {
		const whereClause = `price_per_night <= %L AND price_per_night >= %L AND host_id = %L`;
		const parametricQuery = `WHERE (${whereClause}) ORDER BY %I %s;`;
		return queryFormat(
			`${fetchPropertiesQuery}${parametricQuery}`,
			maxprice,
			minprice,
			host,
			sort,
			order
		).then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "ID not found.",
				});
			}
			return rows;
		});
	}
};

exports.fetchProperty = function (property_id, user_id) {
	if (!user_id) {
		return db
			.query(`${fetchPropertyQueryStart} ${fetchPropertyQueryEnd}`, [property_id])
			.then(({ rows }) => {
				if (_.isEmpty(rows[0])) {
					return Promise.reject({
						status: 404,
						msg: "ID not found.",
					});
				}
				return rows[0];
			});
	} else {
		const sqlCase = `
		, CASE
			WHEN NOT EXISTS (
				SELECT 1
				FROM users
				WHERE user_id = $2
				)
				THEN NULL
			WHEN EXISTS (
				SELECT 1
				FROM favourites
				WHERE favourites.property_id = tmp.property_id
				AND favourites.guest_id = $2
				) 
				THEN TRUE
				ELSE FALSE
			END AS favourited
			`;

		return db
			.query(
				`${fetchPropertyQueryStart} ${sqlCase} ${fetchPropertyQueryEnd}`, [property_id, user_id]
			)
			.then(({ rows }) => {
				if (_.isEmpty(rows[0]) || rows[0].favourited === null) {
					return Promise.reject({
						status: 404,
						msg: "ID not found.",
					});
				}
				return rows[0];
			});
	}
};
