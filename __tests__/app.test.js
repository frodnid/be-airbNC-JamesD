const app = require("../app");
const db = require("../db/connection")
const seed = require("../db/seed")
const request = require("supertest")
beforeEach(()=> {
    return seed();
})

afterAll(()=> {
    return db.end()
})

describe('app', () => {
    describe('/api/properties', () => {
        describe('GET', () => {
            test('200 - should respond with a JSON containing an array of property objects', () => {
                return request(app)
                    .get("/api/properties")
                    .expect(200)
                    .expect("Content-type", /json/)
                    .then(({ body }) => {
                        expect(Array.isArray(body.properties)).toBe(true);
                        body.properties.forEach((property) => {
                            expect(typeof property).toBe("object");
                        })
                    })

            });
            test('property objects should contain default db properties: id, location, price ', () => {
                return request(app)
                .get("/api/properties")
                .expect(200)
                .then(({body : {properties}}) => {
                    properties.forEach((property) => {
                        expect(property).toHaveProperty("property_id");
                        expect(property).toHaveProperty("location");
                        expect(property).toHaveProperty("price_per_night");
                    })
                })
                
            });
            test('property objects should contain alias property: property_name', () => {
                return request(app)
                .get("/api/properties")
                .expect(200)
                .then(({body : {properties}}) => {
                    properties.forEach((property) => {
                        expect(property).toHaveProperty("property_name");
                        expect(property).not.toHaveProperty("name");
                    })
                })
                
            });
            test('property objects should contain custom property: host', () => {
                return request(app)
                .get("/api/properties")
                .expect(200)
                .then(({body : {properties}}) => {
                    properties.forEach((property) => {
                        expect(property).toHaveProperty("host");
                        expect(property).not.toHaveProperty("host_id");
                    })
                })
                
            });
            test('host property should contain first & surnames concatenated', () => {
                const fullNameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/
                return request(app)
                .get("/api/properties")
                .expect(200)
                .then(({body : {properties}}) => {
                    properties.forEach((property) => {
                        expect(fullNameRegex.test(property.host)).toBe(true);
                    })
                })
                
            });
            test('should provide the most recent db data', () => {
                return db.query(`
                    UPDATE users
                    SET first_name = 'Saul', surname = 'Goodman'
                    WHERE user_id = 1;`
                ).then(() => {
                    return db.query(`
                        UPDATE properties
                        SET host_id = 1;`)
                }).then(() => {
                    return request(app)
                    .get("/api/properties")
                    .expect(200)
                    .then(({body : {properties}}) => {
                        properties.forEach((property) => {
                            expect(property.host).toBe("Saul Goodman")
                    })
                })
                })
            });
        });
    });
});