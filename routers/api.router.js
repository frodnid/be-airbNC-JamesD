const express = require("express");
const path = require("path");
const favouritesRouter = require("./favourites.router");
const propertiesRouter = require("./properties.router");
const usersRouter = require("./users.router");
const reviewsRouter = require("./reviews.router");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
	res.sendFile("index.html", {
		root: path.join(__dirname, "../views"),
	});
});

apiRouter.use("/favourites", favouritesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/properties", propertiesRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
