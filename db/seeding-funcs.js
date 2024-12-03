const db = require("./connection");
const format = require("pg-format");
const {
	usersData,
	propertiesData,
	propertyTypesData,
	reviewsData,
	favouritesData,
} = require("./data/test");
const {
	createUsersQuery,
	createPropertiesQuery,
	createPropertyTypesQuery,
	createReviewsQuery,
	createFavouritesQuery,
	insertUsersDataQuery,
	insertPropertiesDataQuery,
	insertPropertyTypesDataQuery,
	insertReviewsDataQuery,
	insertFavouritesDataQuery,
} = require("./queries");
const { createUserIDRef, createPropertyIDRef } = require("./data/data-manip");

exports.dropTables = function () {
	return Promise.all([
		db.query(`DROP TABLE IF EXISTS reviews;`),
		db.query(`DROP TABLE IF EXISTS favourites;`),
	])
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS properties;`);
		})
		.then(() => {
			return Promise.all([
				db.query(`DROP TABLE IF EXISTS users;`),
				db.query(`DROP TABLE IF EXISTS property_types;`),
			]);
		});
};

exports.createTables = function () {
	return Promise.all([
		db.query(createUsersQuery),
		db.query(createPropertyTypesQuery),
	])
		.then(() => {
			return db.query(createPropertiesQuery);
		})
		.then(() => {
			return Promise.all([
				db.query(createReviewsQuery),
				db.query(createFavouritesQuery),
			]);
		});
};

exports.insertData = function () {
	return Promise.all([
		db.query(
			format(
				insertUsersDataQuery,
				usersData.map((dataJSON) => Object.values(dataJSON))
			)
		),
		db.query(
			format(
				insertPropertyTypesDataQuery,
				propertyTypesData.map((dataJSON) => Object.values(dataJSON))
			)
		),
	])
		.then(() => {
			return createUserIDRef();
		})
		.then((userIDRef) => {
			const formattedPropertiesData = propertiesData.map((property) => {
				const { host_name, ...rest } = property;
				const formattedObj = { ...rest, host_id: userIDRef[host_name] };
				return [
					formattedObj.host_id,
					formattedObj.name,
					formattedObj.location,
					formattedObj.property_type,
					formattedObj.price_per_night,
					formattedObj.description,
				];
			});
			return db.query(
				format(insertPropertiesDataQuery, formattedPropertiesData)
			);
		})
		.then(() => {
			return Promise.all([createUserIDRef(), createPropertyIDRef()]);
		})
		.then(([userIDRef, propertyIDRef]) => {
			const formattedReviewsData = reviewsData.map((review) => {
				const { guest_name, property_name, ...rest } = review;
				const formattedObj = {
					...rest,
					guest_id: userIDRef[guest_name],
					property_id: propertyIDRef[property_name],
				};
				return [
					formattedObj.property_id,
					formattedObj.guest_id,
					formattedObj.rating,
					formattedObj.comment,
				];
			});
			const formattedFavouritesData = favouritesData.map((favourite) => {
				return [
					userIDRef[favourite["guest_name"]],
					propertyIDRef[favourite["property_name"]],
				];
			});
			return Promise.all([
				db.query(format(insertReviewsDataQuery, formattedReviewsData)),
				db.query(
					format(insertFavouritesDataQuery, formattedFavouritesData)
				),
			]);
		});
};
