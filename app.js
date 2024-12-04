const express = require("express");

const app = express();

const { getProperties } = require("./controllers/properties")
app.get("/api/properties", getProperties);

module.exports = app;