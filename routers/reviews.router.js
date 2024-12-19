const express = require("express");

const { deleteReview } = require("../controllers/reviews");
const { handleMethodNotAllowed } = require("../controllers/errors");

const reviewsRouter = express.Router();

reviewsRouter.route("/:id").delete(deleteReview).all(handleMethodNotAllowed);

module.exports = reviewsRouter;
