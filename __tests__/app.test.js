const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const request = require("supertest");
beforeEach(() => {
	return seed();
});

afterAll(() => {
	return db.end();
});

describe("app", () => {
	describe("general 404 - invalid path", () => {
		test("should respond with a status of 404 for invalid paths", () => {
			return request(app).get("/api/where_am_i?").expect(404);
		});
		test("should respond with an appropriate error msg object", () => {
			return request(app)
				.get("/api/how_did_i_get_here")
				.expect(404)
				.expect("Content-Type", /json/)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("Path not found.");
				});
		});
	});
	describe("/api/properties", () => {
		describe("GET", () => {
			test("200 - should respond with a JSON containing an array of property objects", () => {
				return request(app)
					.get("/api/properties")
					.expect(200)
					.expect("Content-type", /json/)
					.then(({ body }) => {
						expect(Array.isArray(body.properties)).toBe(true);
						body.properties.forEach((property) => {
							expect(typeof property).toBe("object");
						});
					});
			});
			test("property objects should contain default db properties: id, location, price ", () => {
				return request(app)
					.get("/api/properties")
					.expect(200)
					.then(({ body: { properties } }) => {
						properties.forEach((property) => {
							expect(property).toHaveProperty("property_id");
							expect(property).toHaveProperty("location");
							expect(property).toHaveProperty("price_per_night");
						});
					});
			});
			test("property objects should contain alias property: property_name", () => {
				return request(app)
					.get("/api/properties")
					.expect(200)
					.then(({ body: { properties } }) => {
						properties.forEach((property) => {
							expect(property).toHaveProperty("property_name");
							expect(property).not.toHaveProperty("name");
						});
					});
			});
			test("property objects should contain custom property: host", () => {
				return request(app)
					.get("/api/properties")
					.expect(200)
					.then(({ body: { properties } }) => {
						properties.forEach((property) => {
							expect(property).toHaveProperty("host");
							expect(property).not.toHaveProperty("host_id");
						});
					});
			});
			test("host property should contain first & surnames concatenated", () => {
				const fullNameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
				return request(app)
					.get("/api/properties")
					.expect(200)
					.then(({ body: { properties } }) => {
						properties.forEach((property) => {
							expect(fullNameRegex.test(property.host)).toBe(
								true
							);
						});
					});
			});
			test("should provide the most recent db data", () => {
				return db
					.query(
						`
                    UPDATE users
                    SET first_name = 'Saul', surname = 'Goodman'
                    WHERE user_id = 1;`
					)
					.then(() => {
						return db.query(`
                        UPDATE properties
                        SET host_id = 1;`);
					})
					.then(() => {
						return request(app)
							.get("/api/properties")
							.expect(200)
							.then(({ body: { properties } }) => {
								properties.forEach((property) => {
									expect(property.host).toBe("Saul Goodman");
								});
							});
					});
			});
			test("properties array should be ordered from most-to-least favourited by default", () => {
				return request(app)
					.get("/api/properties")
					.then(({ body: { properties } }) => {
						expect(properties[0].property_name).toBe(
							"Quaint Cottage in the Hills"
						);
						expect(properties[1].property_name).toBe(
							"Cosy Loft in the Heart of the City"
						);
					});
			});
		});
		describe("INVALID METHOD", () => {
			test("405 - should respond with an error msg for any invalid methods", () => {
				const invalidMethods = ["post", "patch", "put", "delete"];
				return Promise.all(
					invalidMethods.map((method) => {
						return request(app)
							[method]("/api/properties")
							.expect(405)
							.expect("Content-Type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Method not allowed.");
							});
					})
				);
			});
		});
	});
});
