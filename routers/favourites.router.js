const express = require("express");

const { deleteFavourite } = require("../controllers/favourites");
const { handleMethodNotAllowed } = require("../controllers/errors");

const favouritesRouter = express.Router();

favouritesRouter
	.route("/:id")
	.delete(deleteFavourite)
	.all(handleMethodNotAllowed);

module.exports = favouritesRouter;
