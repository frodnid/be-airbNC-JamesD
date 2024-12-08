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
