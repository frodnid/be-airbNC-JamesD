const tmp = `WITH tmp AS (SELECT properties.property_id,
name AS property_name,
location,
price_per_night,
COUNT(guest_id) AS popularity, host_id
FROM properties
FULL JOIN favourites
ON favourites.property_id = properties.property_id
GROUP BY properties.property_id 
ORDER BY popularity DESC)
`

exports.fetchPropertiesQuery = `${tmp}
SELECT property_id, 
property_name, 
location, 
CAST (price_per_night AS float), 
first_name || ' ' || surname AS host 
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
`;

exports.fetchPropertiesWithParamsQuery = `${tmp}
SELECT property_id, 
property_name, 
location, 
CAST (price_per_night AS float), 
first_name || ' ' || surname AS host 
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
WHERE (price_per_night <= %L AND price_per_night >= %L)
ORDER BY %I %s
`;
exports.fetchPropertiesByHostQuery = `${tmp}
SELECT property_id, 
property_name, 
location, 
CAST (price_per_night AS float), 
first_name || ' ' || surname AS host 
FROM tmp
JOIN users
ON users.user_id = tmp.host_id
WHERE (price_per_night <= %L AND price_per_night >= %L AND tmp.host_id = %L)
ORDER BY %I %s
`;