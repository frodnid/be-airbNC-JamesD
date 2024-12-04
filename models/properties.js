const db = require("../db/connection");

const {fetchPropertiesQuery} = require("../db/queries");

exports.fetchProperties = function() {
    return db.query(fetchPropertiesQuery)
        .then(({rows}) => rows)
}