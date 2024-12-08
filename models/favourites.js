const db = require("../db/connection");
const { insertFavouriteQuery } = require("./queries");

exports.insertFavourite = function(guest_id, property_id) {
    return db.query(insertFavouriteQuery, [guest_id, property_id])
        .then(({rows}) => rows[0]);
}