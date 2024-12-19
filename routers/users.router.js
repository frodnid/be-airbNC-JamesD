const express = require("express");

const { getUser, patchUser } = require("../controllers/users");
const { handleMethodNotAllowed } = require("../controllers/errors");

const usersRouter = express.Router();

usersRouter
	.route("/:id")
	.get(getUser)
	.patch(patchUser)
	.all(handleMethodNotAllowed);

module.exports = usersRouter;
