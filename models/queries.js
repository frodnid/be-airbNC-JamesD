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

exports.updateUserQuery = `
UPDATE users
SET first_name = $2,
    surname = $3
WHERE user_id = $1;
`;

exports.fetchPropertiesQuery = `
WITH tmp AS (SELECT properties.property_id,
    name AS property_name,
    location,
    price_per_night,
    COUNT(guest_id) AS popularity,
    host_id
FROM properties
FULL JOIN favourites
ON favourites.property_id = properties.property_id
GROUP BY properties.property_id 
ORDER BY popularity DESC)

SELECT property_id, 
    property_name, 
    location, 
    price_per_night::FLOAT, 
    first_name || ' ' || surname AS host 
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
FULL JOIN favourites
ON favourites.property_id = properties.property_id
WHERE properties.property_id = $1
GROUP BY properties.property_id 
)

SELECT property_id, 
    property_name, 
    location, 
    price_per_night::FLOAT,
    description, 
    first_name || ' ' || surname AS host,
    avatar AS host_avatar,
    favourite_count
`;
exports.fetchPropertyQueryEnd = `
FROM tmp
JOIN users
ON users.user_id = tmp.host_id`;

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

exports.removeReviewQuery = `
DELETE FROM reviews
WHERE review_id = $1
RETURNING *;
`;
