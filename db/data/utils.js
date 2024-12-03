exports.createIDRef = function (key, value, data) {
	return data.reduce((ref, row) => {
		ref[row[key]] = row[value];
		return ref;
	}, {});
};
