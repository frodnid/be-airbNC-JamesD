const express = require("express");
const path = require("path");
const favouritesRouter = require("./favourites.router");
const propertiesRouter = require("./properties.router");
const usersRouter = require("./users.router");
const reviewsRouter = require("./reviews.router");
const bookingsRouter = require("./bookings.router");
const viewsAbsolutePath = path.join(__dirname, "../views");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
	res.sendFile("index.html", {
		root: viewsAbsolutePath,
	});
});

apiRouter.get("/api-docs.css", (req, res) => {
	res.sendFile("api-docs.css", {
		root: viewsAbsolutePath,
	});
});

apiRouter.use("/favourites", favouritesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/properties", propertiesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/bookings", bookingsRouter);

module.exports = apiRouter;
