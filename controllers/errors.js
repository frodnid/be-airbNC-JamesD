exports.handlePathNotFound = function (req, res, next) {
	res.status(404).send({ msg: "Path not found." });
};

exports.handleMethodNotAllowed = function (req, res, next) {
	res.status(405).send({ msg: "Method not allowed." });
};

exports.handleBadRequest = function (err, req, res, next) {
	const errorCodes = ["23502", "22P02", "42601", "42703", "22007"];
	if (errorCodes.includes(err.code)) {
		res.status(400).send({ msg: "Bad request." });
	} else {
		next(err);
	}
};

exports.handleForeignKey404 = function (err, req, res, next) {
	if (err.code === "23503") {
		res.status(404).send({ msg: "ID does not exist." });
	} else {
		next(err);
	}
};

exports.handleCustom404 = function (err, req, res, next) {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.handleConstraints = function (err, req, res, next) {
	if (err.constraint) {
		const constraints = {
			unique_favourite: {
				status: 409,
				msg: "Conflicting request.",
			},
			valid_time_interval: {
				status: 400,
				msg: "Bad request.",
			},
		};
		const constraintErr = constraints[err.constraint];
		res.status(constraintErr.status).send({ msg: constraintErr.msg });
	} else {
		next(err);
	}
};

exports.handleExceptions = function (err, req, res, next) {
	if (err.code === "P0001") {
		const exceptions = {
			booking_overlap: {
				status: 409,
				msg: "Conflicting request.",
			},
		};
		const exceptionErr = exceptions[err.detail];
		res.status(exceptionErr.status).send({ msg: exceptionErr.msg });
	} else {
		next(err);
	}
};
