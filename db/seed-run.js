const seed = require("./seed");
const db = require("./connection")
return seed().then(() => {
    return db.end();
})