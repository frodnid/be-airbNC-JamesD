const { fetchUser, updateUser } = require("../models/users");

exports.getUser = function (req, res, next) {
	const { id } = req.params;
	fetchUser(id)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchUser = function (req, res, next) {
	const { id } = req.params;
	const payload = req.body;
	updateUser(id, payload)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};
