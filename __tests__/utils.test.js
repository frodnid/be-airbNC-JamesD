const { createIDRef } = require("../db/data/utils");
const { usersData } = require("../db/data/test");
describe("createIDRef", () => {
	const output = createIDRef("email", "first_name", usersData);
	test("should return an object", () => {
		expect(typeof output).toBe("object");
	});
	test("should return an object with as many properties as there are items in a passed array ", () => {
		expect(Object.keys(output).length).toBe(usersData.length);
	});
	test("returned object's keys should be the values of each data object at the first passed key", () => {
		expect(
			Object.keys(output).every((email) => {
				return /@example.com$/.test(email);
			})
		).toBe(true);
		expect(Object.keys(output)[3]).toBe("frank@example.com");
	});
	test("returned object's values should be each data object's value at the second passed key", () => {
		expect(
			Object.values(output).every((firstName) => {
				return /^[A-Z][a-z]+$/.test(firstName);
			})
		).toBe(true);
		expect(Object.values(output)[3]).toBe("Frank");
	});
	test("should create a reference object for any valid data & key/value", () => {
		const fruits = [
			{ name: "apple", cost: 0.99 },
			{ name: "pear", cost: 0.99 },
			{ name: "banana", cost: 1.19 },
			{ name: "avocado", cost: 1.99 },
		];
		expect(createIDRef("name", "cost", fruits)).toEqual({
			apple: 0.99,
			pear: 0.99,
			banana: 1.19,
			avocado: 1.99,
		});
	});
	test("should not mutate the input array or contained objects", () => {
		const fruits = [
			{ name: "apple", cost: 0.99 },
			{ name: "pear", cost: 0.99 },
			{ name: "banana", cost: 1.19 },
			{ name: "avocado", cost: 1.99 },
		];
		createIDRef("cost", "name", fruits);

		expect(fruits).toEqual([
			{ name: "apple", cost: 0.99 },
			{ name: "pear", cost: 0.99 },
			{ name: "banana", cost: 1.19 },
			{ name: "avocado", cost: 1.99 },
		]);
	});
});
