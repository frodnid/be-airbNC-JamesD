const { fetchProperties } = require("../models/properties");
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
