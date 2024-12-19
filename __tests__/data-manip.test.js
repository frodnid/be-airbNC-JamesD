process.env.NODE_ENV = "test"
const {
	createUserIDRef,
	createPropertyIDRef,
} = require("../db/data/data-manip");
const db = require("../db/connection");
afterAll(() => {
	return db.end();
});
describe("createUserIDRef", () => {
	test("should return a Promise", () => {
		expect(createUserIDRef()).toBeInstanceOf(Promise);
	});
	test("should resolve to an object", () => {
		createUserIDRef().then((data) => {
			expect(typeof data).toBe("object");
		});
	});
	test("object should contain users' full names as keys", () => {
		createUserIDRef().then((ref) => {
			expect(Object.keys(ref)).toContain("Bob Smith");
			expect(Object.keys(ref)).toContain("Alice Johnson");
			expect(Object.keys(ref)).toContain("Isabella Martinez");
		});
	});
	test("object should contain users' ID as values", () => {
		createUserIDRef().then((ref) => {
			expect(ref["Alice Johnson"]).toBe(1);
			expect(ref["Rachel Cummings"]).toBe(6);
		});
	});
});

describe("createPropertyIDRef", () => {
	test("should return a Promise", () => {
		expect(createPropertyIDRef()).toBeInstanceOf(Promise);
	});
	test("should resolve to an object", () => {
		createPropertyIDRef().then((data) => {
			expect(typeof data).toBe("object");
		});
	});
	test("object should contain properties' names as keys", () => {
		createPropertyIDRef().then((ref) => {
			expect(Object.keys(ref)).toContain(
				"Modern Apartment in City Center"
			);
			expect(Object.keys(ref)).toContain("Elegant City Apartment");
			expect(Object.keys(ref)).toContain("Bright and Airy Studio");
		});
	});
	test("object should contain users' ID as values", () => {
		createPropertyIDRef().then((ref) => {
			expect(ref["Cosy Family House"]).toBe(2);
			expect(ref["Charming Studio Retreat"]).toBe(5);
		});
	});
});
