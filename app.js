const express = require("express");
const { handlePathNotFound, handleMethodNotAllowed } = require("./controllers/errors")
const app = express();

const { getProperties } = require("./controllers/properties")

app.route("/api/properties")
    .get(getProperties)
    .all(handleMethodNotAllowed);

app.all("/*", handlePathNotFound);

module.exports = app;