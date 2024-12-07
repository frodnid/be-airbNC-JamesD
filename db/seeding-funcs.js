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
} = require("./seed-queries");
const { createUserIDRef, createPropertyIDRef } = require("./data/data-manip");

const queryFormat = function (query, data) {
	return db.query(format(query, data));
};

exports.dropTables = function () {
	return db
		.query(`DROP TABLE IF EXISTS reviews;`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS favourites;`);
		})
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
insertUsersDataQuery, usersData.map((dataJSON) => Object.values(dataJSON));

exports.insertData = function () {
	return Promise.all([
		queryFormat(
			insertUsersDataQuery,
			usersData.map((dataJSON) => Object.values(dataJSON))
		),
		queryFormat(
			insertPropertyTypesDataQuery,
			propertyTypesData.map((dataJSON) => Object.values(dataJSON))
		),
	])
		.then(() => {
			return createUserIDRef();
		})
		.then((userIDRef) => {
			const formattedPropertiesData = propertiesData.map((property) => {
				return [
					userIDRef[property.host_name],
					property.name,
					property.location,
					property.property_type,
					property.price_per_night,
					property.description,
				];
			});
			return queryFormat(
				insertPropertiesDataQuery,
				formattedPropertiesData
			);
		})
		.then(() => {
			return Promise.all([createUserIDRef(), createPropertyIDRef()]);
		})
		.then(([userIDRef, propertyIDRef]) => {
			const formattedReviewsData = reviewsData.map((review) => {
				return [
					propertyIDRef[review["property_name"]],
					userIDRef[review["guest_name"]],
					review.rating,
					review.comment,
				];
			});
			const formattedFavouritesData = favouritesData.map((favourite) => {
				return [
					userIDRef[favourite["guest_name"]],
					propertyIDRef[favourite["property_name"]],
				];
			});
			return Promise.all([
				queryFormat(insertReviewsDataQuery, formattedReviewsData),
				queryFormat(insertFavouritesDataQuery, formattedFavouritesData),
			]);
		});
};
