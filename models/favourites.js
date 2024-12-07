const db = require("../db/connection");

exports.insertFavourite = function(guest_id, property_id) {
    return db.query(`
            INSERT INTO favourites (
                guest_id, 
                property_id) 
            VALUES ($1, $2)
            RETURNING favourite_id;
       `, [guest_id, property_id])
        .then(({rows}) => rows[0]);
}