const db = require("./connection");
const format = require("pg-format");
const ENV = process.env.NODE_ENV || "development";
const {
	usersData,
	propertiesData,
	propertyTypesData,
	reviewsData,
	favouritesData,
	imagesData,
} = require(`${__dirname}/data/${ENV}`);
const {
	createUsersQuery,
	createPropertiesQuery,
	createPropertyTypesQuery,
	createReviewsQuery,
	createFavouritesQuery,
	createImagesQuery,
	insertUsersDataQuery,
	insertPropertiesDataQuery,
	insertPropertyTypesDataQuery,
	insertReviewsDataQuery,
	insertFavouritesDataQuery,
	insertImagesDataQuery,
} = require("./seed-queries");
const { createUserIDRef, createPropertyIDRef } = require("./data/data-manip");

const queryFormat = function (query, data) {
	return db.query(format(query, data));
};

exports.dropTables = function () {
	return db
		.query(`DROP TABLE IF EXISTS reviews;`)
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS images;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS favourites;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS properties;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS users;`);
		})
		.then(() => {
			return db.query(`DROP TABLE IF EXISTS property_types;`);
		});
};

exports.createTables = function () {
	return db
		.query(createUsersQuery)
		.then(() => {
			return db.query(createPropertyTypesQuery);
		})
		.then(() => {
			return db.query(createPropertiesQuery);
		})
		.then(() => {
			return db.query(createReviewsQuery);
		})
		.then(() => {
			return db.query(createFavouritesQuery);
		})
		.then(() => {
			return db.query(createImagesQuery);
		});
};

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
			return Promise.all([
				userIDRef,
				queryFormat(insertPropertiesDataQuery, formattedPropertiesData),
			]);
		})
		.then(([userIDRef]) => {
			return Promise.all([userIDRef, createPropertyIDRef()]);
		})
		.then((refs) => {
			const [userIDRef, propertyIDRef] = refs;
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
				refs,
				queryFormat(insertReviewsDataQuery, formattedReviewsData),
				queryFormat(insertFavouritesDataQuery, formattedFavouritesData),
			]);
		})
		.then(([refs]) => {
			const propertyIDRef = refs[1];
			const formattedImagesData = imagesData.map((image) => {
				return [
					propertyIDRef[image["property_name"]],
					image.image_url,
					image.alt_tag,
				];
			});
			return queryFormat(insertImagesDataQuery, formattedImagesData);
		});
};
