var Emitter = require('guidance-replay').Emitter;
var route = require('guidance-replay').route;
var stepsTaken = require('../lib/stepsTaken');
var test = require('tape');

test('Tests stepsTaken', function (assert) {
  var config_route = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json'))).route;
  var geojson = route(config_route);
  var emitter = new Emitter(geojson, 1000);
  var before = emitter.next();
  assert.deepEqual(before.coords, geojson.geometry.coordinates[0], 'Coords should equal first coordinates');
  assert.equal(before.time, 0, 'Time should equal 0');
  
  stepsTaken(emitter, 5000);
  var after = emitter.next();
  assert.ok(Math.abs(after.coords[0]-(-105.5817472000664)) < 0.000001 && Math.abs(after.coords[1]-(40.36620720002134)) < 0.000001, 'Coords should be within reasonable threshold of expected');
  assert.equal(after.time, 5000, 'Time should equal 5000');
  assert.end();
});