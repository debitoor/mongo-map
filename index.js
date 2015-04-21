module.exports = getInMap;

function getInMap(mapObject, keyExpression) {
	var keys = Object.keys(mapObject).sort();
	if (keys.length === 0) {
		return {$literal: null};
	}
	var tree = buildTree(0, keys.length - 1);
	return tree;

	function buildTree(start, end) {
		var elements = end - start + 1;
		if (elements === 1) {
			var key = keys[start];
			return {$cond: [{$eq: [keyExpression, key]}, {$literal: mapObject[key]}, null]};
		}
		if (elements === 2) {
			var startKey = keys[start];
			return {
				$cond: [
					{ $eq: [keyExpression, startKey] },
					{ $literal: mapObject[startKey] },
					buildTree(start + 1, end)
				]
			};
		}
		if (elements > 2) {
			var middle = Math.ceil((start + end) / 2);
			var middleKey = keys[middle];
			return {
				$cond: [
					{ $lt: [keyExpression, middleKey] },
					buildTree(start, middle - 1),
					buildTree(middle, end)
				]
			};
		}
	}
}