const { fetchProperties, fetchProperty } = require("../models/properties");
const _ = require("lodash");
exports.getProperties = function (req, res, next) {
	const queries = req.query;
	const hasQueries = !_.isEmpty(queries);
	if (hasQueries) {
		fetchProperties(queries)
			.then((properties) => {
				res.send({ properties });
			})
			.catch((err) => {
				next(err);
			});
	} else {
		fetchProperties()
			.then((properties) => {
				res.send({ properties });
			})
			.catch((err) => {
				next(err);
			});
	}
};

exports.getProperty = function (req, res, next) {
	const { user_id } = req.query;
	const property_id = req.params.id;
	fetchProperty(property_id, user_id)
		.then((property) => {
			res.status(200).send({ property });
		})
		.catch((err) => {
			next(err);
		});
};
