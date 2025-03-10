exports.fetchUserQuery = `
SELECT user_id,
    first_name,
    surname,
    email,
    phone_number,
    avatar,
    created_at
FROM users
WHERE user_id = $1;
`;

exports.fetchPropertiesQuery = `
WITH tmp AS (
    SELECT 
        properties.property_id,
        name AS property_name,
        location,
        price_per_night,
        COUNT(favourites.guest_id) AS popularity,
        host_id
    FROM properties
    LEFT JOIN favourites
    ON favourites.property_id = properties.property_id
    GROUP BY properties.property_id, name, location, price_per_night, host_id
    ORDER BY popularity DESC
)

SELECT 
    tmp.property_id, 
    property_name, 
    location, 
    price_per_night::FLOAT, 
    first_name || ' ' || surname AS host,
    (SELECT image_url
    FROM images
    WHERE images.property_id = tmp.property_id
    ORDER BY image_id
    LIMIT 1 ) AS image
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
`;

exports.fetchPropertyQueryStart = `
WITH tmp AS (SELECT properties.property_id,
    name AS property_name,
    location,
    description,
    price_per_night,
    COUNT(guest_id)::INT AS favourite_count,
    host_id
FROM properties
LEFT JOIN favourites
ON favourites.property_id = properties.property_id
WHERE properties.property_id = $1
GROUP BY properties.property_id 
)

SELECT tmp.property_id, 
    property_name, 
    location, 
    price_per_night::FLOAT,
    description, 
    first_name || ' ' || surname AS host,
    avatar AS host_avatar,
    favourite_count,
    COALESCE(ARRAY_AGG(image_url), '{}'::VARCHAR[]) AS images
`;
exports.fetchPropertyQueryEnd = `
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
LEFT JOIN images
ON images.property_id = tmp.property_id
GROUP BY tmp.property_id, property_name, location, price_per_night, description, host, host_avatar, favourite_count;
`;

exports.insertFavouriteQuery = `
INSERT INTO favourites (
    guest_id, 
    property_id) 
VALUES ($1, $2)
RETURNING favourite_id;
`;
exports.removeFavouriteQuery = `
DELETE FROM favourites
WHERE favourite_id = $1
RETURNING *;
`;

exports.fetchPropertyReviewsQuery = `
SELECT review_id,
    comment,
    rating,
    reviews.created_at,
    first_name || ' ' || surname AS guest,
    avatar AS guest_avatar
FROM reviews
JOIN users
ON users.user_id = reviews.guest_id
WHERE property_id = $1
ORDER BY reviews.created_at DESC;
`;

exports.fetchPropertyBookingsQuery = `
SELECT booking_id,
    check_in_date::DATE,
    check_out_date::DATE,
    created_at
FROM bookings
WHERE property_id = $1
ORDER BY check_out_date DESC;
`;

exports.fetchUserBookingsQuery = `
SELECT booking_id,
    check_in_date,
    check_out_date,
    bookings.property_id,
    name AS property_name,
    first_name || ' ' || surname AS host, 
    (   SELECT image_url
        FROM images
        WHERE images.property_id = bookings.property_id
        ORDER BY image_id
        LIMIT 1 ) 
    AS image
FROM bookings
JOIN properties
ON bookings.property_id = properties.property_id
JOIN users
ON users.user_id = properties.host_id
WHERE guest_id = $1
ORDER BY check_in_date;`;

exports.fetchUserFavouritesQuery = `
SELECT favourite_id,
    property_id
    FROM favourites
    WHERE guest_id = $1;`;

exports.insertReviewQuery = `
INSERT INTO reviews (
    guest_id,
    property_id,
    rating,
    comment)
VALUES ($1, $2, $3, $4)
RETURNING 
    review_id,
    property_id,
    guest_id,
    rating,
    comment,
    created_at;
    `;

exports.insertBookingQuery = `
INSERT INTO bookings (
    guest_id, 
    property_id,
    check_in_date,
    check_out_date)
VALUES ($1, $2, $3, $4)
RETURNING booking_id;
`;
exports.removeReviewQuery = `
DELETE FROM reviews
WHERE review_id = $1
RETURNING *;
`;

exports.removeBookingQuery = `
DELETE FROM bookings
WHERE booking_id = $1
RETURNING *;
`;
