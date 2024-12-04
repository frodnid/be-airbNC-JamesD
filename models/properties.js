const db = require("../db/connection");
const format = require("pg-format");

const {
	fetchPropertiesQuery,
	fetchPropertiesWithParamsQuery,
	fetchPropertiesByHostQuery,
} = require("../db/queries");

exports.fetchProperties = function (queries) {
	if (!queries) {
		return db.query(fetchPropertiesQuery).then(({ rows }) => {
			return rows.map((property) => {
				property.price_per_night = Number(property.price_per_night);
				return property;
			});
		});
	}

	const {
		maxprice = 9999,
		minprice = 0,
		sort = "popularity",
		order = "asc",
		host,
	} = queries;

	if (host) {
		return db
			.query(
				format(
					fetchPropertiesByHostQuery,
					maxprice,
					minprice,
					host,
					sort,
					order
				)
			)
			.then(({ rows }) => {
				return rows.map((property) => {
					property.price_per_night = Number(property.price_per_night);
					return property;
				});
			});
	}
	return db
		.query(
			format(
				fetchPropertiesWithParamsQuery,
				maxprice,
				minprice,
				sort,
				order
			)
		)
		.then(({ rows }) => {
			return rows.map((property) => {
				property.price_per_night = Number(property.price_per_night);
				return property;
			});
		});
};
