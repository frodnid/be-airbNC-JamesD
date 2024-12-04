const {fetchProperties} = require("../models/properties");
exports.getProperties = function(req, res, next) {
    fetchProperties().then((properties)=> {
        res.send({properties})
    })
}