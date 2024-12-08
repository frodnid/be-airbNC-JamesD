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
			describe("url queries", () => {
				test("maxprice - should only respond with properties at or below a given price", () => {
					return request(app)
						.get("/api/properties?maxprice=100")
						.expect(200)
						.then(({ body: { properties } }) => {
							properties.forEach((property) => {
								expect(
									property.price_per_night
								).toBeLessThanOrEqual(100);
							});
						});
				});
				test("minprice - should only respond with properties at or above a given price", () => {
					return request(app)
						.get("/api/properties?minprice=110")
						.expect(200)
						.then(({ body: { properties } }) => {
							properties.forEach((property) => {
								expect(
									property.price_per_night
								).toBeGreaterThanOrEqual(100);
							});
						});
				});
				test("sort - should sort by cost if passed", () => {
					return request(app)
						.get("/api/properties?sort=price_per_night")
						.expect(200)
						.then(({ body: { properties } }) => {
							expect(properties).toBeSortedBy("price_per_night");
						});
				});
				test("order - should order by a given direction (asc/desc)", () => {
					return request(app)
						.get("/api/properties?sort=price_per_night&order=desc")
						.expect(200)
						.then(({ body: { properties } }) => {
							expect(properties).toBeSortedBy("price_per_night", {
								descending: true,
							});
						});
				});
				test("host - should filter results by a given host ID", () => {
					return request(app)
						.get("/api/properties?host=1")
						.expect(200)
						.then(({ body: { properties } }) => {
							properties.forEach((property) => {
								expect(property.host).toBe("Alice Johnson");
							});
						});
				});
				describe("400 - bad request", () => {
					test("maxprice - invalid type", () => {
						return request(app)
							.get("/api/properties?maxprice=fish")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
					test("minprice - invalid type", () => {
						return request(app)
							.get("/api/properties?minprice=and-chips")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
					test("host - invalid type", () => {
						return request(app)
							.get("/api/properties?host=saveloy")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
					test("order - invalid type", () => {
						return request(app)
							.get("/api/properties?order=10")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
					test("order - invalid value", () => {
						return request(app)
							.get("/api/properties?order=what")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
					test("sort - invalid value", () => {
						return request(app)
							.get("/api/properties?sort=who")
							.expect(400)
							.expect("Content-type", /json/)
							.then(({ body: { msg } }) => {
								expect(msg).toBe("Bad request.");
							});
					});
				});
				test("404 - host id not found", () => {
					return request(app)
						.get("/api/properties?host=9999")
						.expect(404)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("ID not found.");
						});
				});
				test("404 - maxprice too low", () => {
					return request(app)
						.get("/api/properties?maxprice=1")
						.expect(404)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("No properties in price range.");
						});
				});
				test("404 - minprice too high", () => {
					return request(app)
						.get("/api/properties?minprice=99999")
						.expect(404)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("No properties in price range.");
						});
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
	describe.only("/api/properties/:id", () => {
		describe("GET", () => {
			test("200 - should respond with a JSON containing a single property object", () => {
				return request(app)
					.get("/api/properties/10")
					.expect(200)
					.expect("Content-type", /json/)
					.then(({ body }) => {
						expect(typeof body.property).toBe("object");
						expect(Array.isArray(body.property)).toBe(false);
					});
			});
			test("property object should contain default db properties: id, location, description, price", () => {
				return request(app)
					.get("/api/properties/2")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property).toHaveProperty("property_id");
						expect(property).toHaveProperty("price_per_night");
						expect(property).toHaveProperty("location");
						expect(property).toHaveProperty("description");
					});
			});
			test("property object should contain alias property: property_name", () => {
				return request(app)
					.get("/api/properties/2")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property).toHaveProperty("property_name");
						expect(property).not.toHaveProperty("name");
					});
			});
			test("property object should contain custom properties: host, host_avatar, favourite_count", () => {
				return request(app)
					.get("/api/properties/11")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property).toHaveProperty("host");
						expect(property).toHaveProperty("host_avatar");
						expect(property).toHaveProperty("favourite_count");
					});
			});
			test("host property should contain first & surnames concatenated", () => {
				return request(app)
					.get("/api/properties/1")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property.host).toBe("Alice Johnson");
					});
			});
			test("favourite_count should contain the number of guest_ids in the favourites table at that property's id", () => {
				return request(app)
					.get("/api/properties/10")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property.favourite_count).toBe(4);
					});
			});
			test("should provide the most recent db data", () => {
				const newProperty = [
					1,
					"Run Down Shack",
					"Nowhere",
					"House",
					0.01,
					"Don't stay here.",
				];
				return db
					.query(
						`INSERT INTO properties(host_id, name, location, property_type, price_per_night, description)
					VALUES ($1, $2, $3, $4, $5, $6);`,
						newProperty
					)
					.then(() => {
						return request(app)
							.get("/api/properties/12")
							.expect(200);
					})
					.then(({ body: { property } }) => {
						expect(property).toEqual({
							property_id: 12,
							property_name: "Run Down Shack",
							location: "Nowhere",
							price_per_night: 0.01,
							description: "Don't stay here.",
							host: "Alice Johnson",
							host_avatar: "https://example.com/images/alice.jpg",
							favourite_count: 0,
						});
					});
			});
			test("if passed a user_id query param, response object should include a favourited property", () => {
				return request(app)
					.get("/api/properties/10?user_id=4")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property).toHaveProperty("favourited");
					});
			});
			test("true - favourited property should include a boolean representing if a passed user_id has favourited a given property", () => {
				return request(app)
					.get("/api/properties/10?user_id=4")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property.favourited).toBe(true);
					});
			});
			test("false - favourited property should include a boolean representing if a passed user_id has favourited a given property", () => {
				return request(app)
					.get("/api/properties/1?user_id=5")
					.expect(200)
					.then(({ body: { property } }) => {
						expect(property.favourited).toBe(false);
					});
			});
			test("404 - property id not found ", () => {
				return request(app)
					.get("/api/properties/9999999")
					.expect(404)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("ID not found.");
					});
			});
			test("404 - user id not found ", () => {
				return request(app)
					.get("/api/properties/1?user_id=9999999")
					.expect(404)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("ID not found.");
					});
			});
			test("400 - invalid property id type", () => {
				return request(app)
					.get("/api/properties/building")
					.expect(400)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Bad request.");
					});
			});
			test("400 - invalid user id type", () => {
				return request(app)
					.get("/api/properties/1?user_id=me!")
					.expect(400)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Bad request.");
					});
			});
		});
		describe("INVALID METHOD", () => {
			test("405 - should respond with an error msg for any invalid methods", () => {
				const invalidMethods = ["post", "patch", "put", "delete"];
				return Promise.all(
					invalidMethods.map((method) => {
						return request(app)
							[method]("/api/properties/1")
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
	describe("/api/properties/:id/favourite", () => {
		describe("POST", () => {
			test("201 - should respond with status 201 when sent a valid guest_id payload at a valid property_id", () => {
				return request(app)
					.post("/api/properties/1/favourite")
					.send({ guest_id: 2 })
					.expect(201);
			});
			test("should add a favourite to the database", () => {
				return request(app)
					.post("/api/properties/1/favourite")
					.send({ guest_id: 2 })
					.expect(201)
					.then(() => {
						return db.query("SELECT * FROM favourites;");
					})
					.then(({ rows }) => {
						expect(rows.length).toBe(16);
					});
			});
			test("added favourite should contain passed guest and property ids", () => {
				return request(app)
					.post("/api/properties/11/favourite")
					.send({ guest_id: 2 })
					.expect(201)
					.then(() => {
						return db.query("SELECT * FROM favourites;");
					})
					.then(({ rows }) => {
						expect(rows[15].guest_id).toBe(2);
						expect(rows[15].property_id).toBe(11);
					});
			});
			test("should respond with an object containing the following properties: msg, favourite_id", () => {
				return request(app)
					.post("/api/properties/11/favourite")
					.send({ guest_id: 2 })
					.expect(201)
					.then(({ body }) => {
						expect(body).toHaveProperty("msg");
						expect(body).toHaveProperty("favourite_id");
					});
			});
			test("response object should contain a set success message and id of posted favourite", () => {
				return request(app)
					.post("/api/properties/1/favourite")
					.send({ guest_id: 5 })
					.expect(201)
					.then(({ body: { msg, favourite_id } }) => {
						expect(msg).toBe("Property favourited successfully.");
						expect(favourite_id).toBe(16);
					});
			});
			describe("400 - Bad request", () => {
				test("property id not in properties table ", () => {
					return request(app)
						.post("/api/properties/99999/favourite")
						.send({ guest_id: 1 })
						.expect(400)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("Bad request.");
						});
				});
				test("invalid property id type", () => {
					return request(app)
						.post("/api/properties/fish/favourite")
						.send({ guest_id: 1 })
						.expect(400)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("Bad request.");
						});
				});
				test("guest id not in guests table", () => {
					return request(app)
						.post("/api/properties/5/favourite")
						.send({ guest_id: 105 })
						.expect(400)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("Bad request.");
						});
				});
				test("invalid guest id type", () => {
					return request(app)
						.post("/api/properties/5/favourite")
						.send({ guest_id: "fish" })
						.expect(400)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("Bad request.");
						});
				});
				test("invalid body object key", () => {
					return request(app)
						.post("/api/properties/5/favourite")
						.send({ fish_id: 2 })
						.expect(400)
						.expect("Content-type", /json/)
						.then(({ body: { msg } }) => {
							expect(msg).toBe("Bad request.");
						});
				});
			});
			test("409 - property already favourited by user", () => {
				return request(app)
					.post("/api/properties/10/favourite")
					.send({ guest_id: 6 })
					.expect(409)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Conflicting request.");
					});
			});
		});
		describe("INVALID METHOD", () => {
			test("405 - should respond with an error msg for any invalid methods", () => {
				const invalidMethods = ["get", "patch", "put", "delete"];
				return Promise.all(
					invalidMethods.map((method) => {
						return request(app)
							[method]("/api/properties/1/favourite")
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
	describe("/api/favourites/:id", () => {
		describe("DELETE", () => {
			test("204 - should respond with status code 204 on deletion", () => {
				return request(app).delete("/api/favourites/2").expect(204);
			});
			test("response should have no body", () => {
				return request(app)
					.delete("/api/favourites/3")
					.expect(204)
					.then(({ body }) => {
						expect(body).toEqual({});
					});
			});
			test("should remove a favourite from the database using the parametric id", () => {
				return request(app)
					.delete("/api/favourites/3")
					.expect(204)
					.then(() => {
						return db.query(`SELECT favourite_id FROM favourites;`);
					})
					.then(({ rows }) => {
						expect(rows.length).toBe(14);
						expect(rows).not.toContainEqual({ favourite_id: 3 });
					});
			});
			test("404 - id not found", () => {
				return request(app)
					.delete("/api/favourites/91919191")
					.expect(404)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("ID not found.");
					});
			});
			test("400 - invalid id type", () => {
				return request(app)
					.delete("/api/favourites/colours")
					.expect(400)
					.expect("Content-type", /json/)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Bad request.");
					});
			});
		});
		describe("INVALID METHOD", () => {
			test("405 - should respond with an error msg for any invalid methods", () => {
				const invalidMethods = ["get", "patch", "put", "post"];
				return Promise.all(
					invalidMethods.map((method) => {
						return request(app)
							[method]("/api/favourites/1")
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
