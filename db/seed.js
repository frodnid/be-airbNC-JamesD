const { dropTables, createTables, insertData } = require("./seeding-funcs")

function seed() {
	return dropTables()
		.then(() => {
			return createTables();
		})
		.then(() => {
			return insertData();
		});
};

module.exports = seed;
