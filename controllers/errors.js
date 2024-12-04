exports.handlePathNotFound = function (req, res, next) {
	res.status(404).send({ msg: "Path not found." });
};

exports.handleMethodNotAllowed = function(req, res, next) {
    res.status(405).send({ msg: "Method not allowed."})
}