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
    property_id INTEGER NOT NULL REFERENCES properties,
    CONSTRAINT unique_favourite UNIQUE (guest_id, property_id)
);`;

exports.createImagesQuery = `
CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties,
    image_url VARCHAR NOT NULL,
    alt_text VARCHAR NOT NULL
    );
`;

exports.createBookingsQuery = `
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties,
    guest_id INTEGER NOT NULL REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
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

exports.insertImagesDataQuery = `
INSERT INTO images (
    property_id,
    image_url,
    alt_text)
VALUES %L;
`;

exports.insertBookingsDataQuery = `
INSERT INTO bookings (
    property_id,
    guest_id,
    check_in_date,
    check_out_date
    )
VALUES %L;`;

exports.checkBookingFuncQuery = `
CREATE OR REPLACE FUNCTION check_availability() 
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM bookings
        WHERE booking_id <> NEW.booking_id
        AND property_id = NEW.property_id
        AND (NEW.check_in_date, NEW.check_out_date) OVERLAPS (check_in_date, check_out_date)
    ) THEN
        RAISE EXCEPTION 'New booking overlaps with existing booking';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;
exports.addBookingsTriggerQuery = `
CREATE TRIGGER check_available_booking
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_availability();
`;
