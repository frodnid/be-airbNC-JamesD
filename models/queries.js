exports.fetchPropertiesQuery = `
WITH tmp AS (SELECT properties.property_id,
    name AS property_name,
    location,
    price_per_night,
    COUNT(guest_id) AS popularity, host_id
FROM properties
FULL JOIN favourites
ON favourites.property_id = properties.property_id
GROUP BY properties.property_id 
ORDER BY popularity DESC)

SELECT property_id, 
    property_name, 
    location, 
    CAST (price_per_night AS float), 
    first_name || ' ' || surname AS host 
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
`;

exports.insertFavouriteQuery = `
INSERT INTO favourites (
    guest_id, 
    property_id) 
VALUES ($1, $2)
RETURNING favourite_id;
`
