exports.handlePathNotFound = function (req, res, next) {
	res.status(404).send({ msg: "Path not found." });
};

exports.handleMethodNotAllowed = function (req, res, next) {
	res.status(405).send({ msg: "Method not allowed." });
};

exports.handleBadRequest = function (err, req, res, next) {
	const errorCodes = ["23502", "23503", "22P02", "42601", "42703"];
	if (errorCodes.includes(err.code)) {
		res.status(400).send({ msg: "Bad request." });
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

exports.handleConflictingRequest = function (err, req, res, next) {
	if (err.code === "23505") {
		res.status(409).send({ msg: "Conflicting request." });
	} else {
		next(err);
	}
};
