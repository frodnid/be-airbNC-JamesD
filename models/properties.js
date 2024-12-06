const db = require("../db/connection");
const format = require("pg-format");
const queryFormat = function (query, ...args) {
	return db.query(format(query, ...args));
};
const { fetchPropertiesQuery } = require("./queries");

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
