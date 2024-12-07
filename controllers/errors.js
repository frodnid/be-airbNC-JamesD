exports.handlePathNotFound = function (req, res, next) {
	res.status(404).send({ msg: "Path not found." });
};

exports.handleMethodNotAllowed = function (req, res, next) {
	res.status(405).send({ msg: "Method not allowed." });
};

exports.handleBadRequest = function (err, req, res, next) {
	if (err.code === "22P02" || err.code === "42601" || err.code === "42703") {
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
