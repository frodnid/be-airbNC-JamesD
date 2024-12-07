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

exports.createPropertiesQuery = `
CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    host_id INTEGER NOT NULL REFERENCES users(user_id),
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL REFERENCES property_types,
    price_per_night DECIMAL NOT NULL,
    description TEXT
);`;

exports.createReviewsQuery = `
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties,
    guest_id INTEGER NOT NULL REFERENCES users(user_id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`;

exports.createFavouritesQuery = `
CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL REFERENCES users(user_id),
    property_id INTEGER NOT NULL REFERENCES properties
);`;

exports.insertUsersDataQuery = `
INSERT INTO users
    (first_name,
    surname,
    email,
    phone_number,
    role,
    avatar)
VALUES %L;`;

exports.insertPropertyTypesDataQuery = `
INSERT INTO property_types (
    property_type,
    description)
VALUES %L;`;

exports.insertPropertiesDataQuery = `
INSERT INTO properties (
    host_id,
    name,
    location,
    property_type,
    price_per_night,
    description)
VALUES %L;`;

exports.insertReviewsDataQuery = `
INSERT INTO reviews (
    property_id,
    guest_id,
    rating,
    comment)
VALUES %L;`;

exports.insertFavouritesDataQuery = `
INSERT INTO favourites (
    guest_id,
    property_id)
VALUES %L;`;


