const db = require("./connection");
const {createUsersQuery, createPropertiesQuery, createPropertyTypesQuery, insertUsersDataQuery, insertPropertiesDataQuery, insertPropertyTypesDataQuery} = require("./queries");
exports.dropTables = function() {
    return Promise.all([db.query(`DROP TABLE IF EXISTS users;`),
        db.query(`DROP TABLE IF EXISTS property_types;`)
    ])
    
}

exports.createTables = function() {
    return Promise.all([db.query(createUsersQuery), db.query(createPropertyTypesQuery)])

}

exports.insertData = function() {
    return Promise.all([db.query(insertUsersDataQuery), db.query(insertPropertyTypesDataQuery)])
}
