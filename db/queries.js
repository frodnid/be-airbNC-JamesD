const format = require("pg-format");
const usersData = require("./data/test/users.json");
const propertyTypesData = require("./data/test/property-types.json");

exports.createUsersQuery = `
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL, 
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR CHECK (role = 'host' OR role = 'guest'),
    avatar VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`;

exports.createPropertyTypesQuery = `
CREATE TABLE property_types (
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
);`;

// exports.createPropertiesQuery = `
// CREATE TABLE properties (
//     property_id SERIAL PRIMARY KEY,
//     host_id INTEGER REFERENCES users.user_id CHECK (users.role = 'host'),
//     name VARCHAR NOT NULL,
//     location VARCHAR NOT NULL,
//     property_type VARCHAR NOT NULL REFERENCES property_types,
//     price_per_night DECIMAL NOT NULL,
//     description TEXT
// );`;

exports.insertUsersDataQuery = format(
	`
INSERT INTO users
    (first_name,
    surname,
    email,
    phone_number,
    role,
    avatar)
VALUES %L;`,
	usersData.map((dataJSON) => Object.values(dataJSON))
);

exports.insertPropertyTypesDataQuery = format(
	`
INSERT INTO property_types (
    property_type,
    description)
VALUES %L;`,
	propertyTypesData.map((dataJSON) => Object.values(dataJSON))
);

// exports.insertPropertiesDataQuery = format(
// 	`
// INSERT INTO properties (
//     host_id,
//     name,
//     location,
//     property_type,
//     price_per_night,
//     description)
// VALUES %L;`,
// 	[data]
// );
