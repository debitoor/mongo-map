var getInMap = require('../index');

var mongojs = require('mongojs');
var db = mongojs('testDB', ['testCollection']);

describe('getInMap', function() {
	after(cleanDB);

	function cleanDB(callback) {
		db.testCollection.drop(callback);
	}

	var map = {
		'key1': 'value1',
		'key2': 'value2',
		'key3': 'value3',
		'key4': 'value4',
		'key5': 'value5',
		'key6': 'value6',
		'key7': 'value7'
	};

	describe('create test doc with some strings and get them in map', function() {
		var result;

		before(function(done) {
			var doc = {
				input: [ 'key1', 'key2', 'key3', 'key4', 'key5', 'other' ]
			};
			db.testCollection.save(doc, done);
		});

		before(function(done) {
			db.testCollection.aggregate([
				{ $project: {
					_id: 0,
					output: {
						$map: {
							input: '$input',
							as: 'key',
							in: getInMap(map, '$$key')
						}
					}
				} }
			], function(err, res) {
				result = res && res[0];
				done(err);
			});
		});

		it('should have correct values', function() {
			expect(result).to.eql({
				output: ['value1', 'value2', 'value3', 'value4', 'value5', null]
			});
		});
	});
});
