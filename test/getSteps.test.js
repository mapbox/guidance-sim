var getStep = require('../lib/getStep');
var test = require('tape');

test('getSteps v4', function (assert) {
  var geojson = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json'))).route;
  assert.equal(getStep(geojson, 0,     'v4', 'step'), 0, 'Time 0 should correspond to step 0');
  assert.equal(getStep(geojson, 24000, 'v4', 'step'), 0, 'Time 0 should correspond to step 0');
  assert.equal(getStep(geojson, 25000, 'v4', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 26000, 'v4', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 66000, 'v4', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 67000, 'v4', 'step'), 2, 'Time 0 should correspond to step 2');
  assert.equal(getStep(geojson, 68000, 'v4', 'step'), 2, 'Time 0 should correspond to step 2');

  var step0lon = geojson.routes[0].steps[0].maneuver.location.coordinates[0];
  var step0lat = geojson.routes[0].steps[0].maneuver.location.coordinates[1];
  var step1lon = geojson.routes[0].steps[1].maneuver.location.coordinates[0];
  var step1lat = geojson.routes[0].steps[1].maneuver.location.coordinates[1];
  var step2lon = geojson.routes[0].steps[2].maneuver.location.coordinates[0];
  var step2lat = geojson.routes[0].steps[2].maneuver.location.coordinates[1];
  var step3lon = geojson.routes[0].steps[3].maneuver.location.coordinates[0];
  var step3lat = geojson.routes[0].steps[3].maneuver.location.coordinates[1];

  assert.ok(Math.abs(getStep(geojson, 0, 'v4', 'coords').geometry.coordinates[0] - step0lon) < 0.00001 &&
            Math.abs(getStep(geojson, 0, 'v4', 'coords').geometry.coordinates[1] - step0lat) < 0.00001, 'Time 0 should correspond to first coordinates');
  assert.ok(getStep(geojson, 24000, 'v4', 'coords').geometry.coordinates[0] < step0lon && getStep(geojson, 24000, 'v4', 'coords').geometry.coordinates[0] > step1lon &&
            getStep(geojson, 24000, 'v4', 'coords').geometry.coordinates[1] < step0lat && getStep(geojson, 24000, 'v4', 'coords').geometry.coordinates[1] > step1lat, 'Coordinates should fall into step 0');
  assert.ok(Math.abs(getStep(geojson, 25000, 'v4', 'coords').geometry.coordinates[0] - step1lon) < 0.00001 &&
            Math.abs(getStep(geojson, 25000, 'v4', 'coords').geometry.coordinates[1] - step1lat) < 0.00001, 'Time 25000 should correspond to second coordinates');
  assert.ok(getStep(geojson, 66000, 'v4', 'coords').geometry.coordinates[0] < step1lon && getStep(geojson, 66000, 'v4', 'coords').geometry.coordinates[0] > step2lon &&
            getStep(geojson, 66000, 'v4', 'coords').geometry.coordinates[1] < step1lat && getStep(geojson, 66000, 'v4', 'coords').geometry.coordinates[1] > step2lat, 'Coordinates should fall into step 1');
  assert.ok(Math.abs(getStep(geojson, 67000, 'v4', 'coords').geometry.coordinates[0] - step2lon) < 0.00001 &&
            Math.abs(getStep(geojson, 67000, 'v4', 'coords').geometry.coordinates[1] - step2lat) < 0.00001, 'Time 67000 should correspond to third coordinates');
  assert.ok(getStep(geojson, 68000, 'v4', 'coords').geometry.coordinates[0] < step2lon && getStep(geojson, 68000, 'v4', 'coords').geometry.coordinates[0] > step3lon &&
            getStep(geojson, 68000, 'v4', 'coords').geometry.coordinates[1] < step2lat && getStep(geojson, 68000, 'v4', 'coords').geometry.coordinates[1] > step3lat, 'Coordinates should fall into step 2');
  assert.end();
});

test('getSteps v5', function (assert) {
  var geojson = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json'))).route;
  assert.equal(getStep(geojson, 0,      'v5', 'step'), 0, 'Time 0 should correspond to step 0');
  assert.equal(getStep(geojson, 46800,  'v5', 'step'), 0, 'Time 0 should correspond to step 0');
  assert.equal(getStep(geojson, 47800,  'v5', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 48800,  'v5', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 219700, 'v5', 'step'), 1, 'Time 0 should correspond to step 1');
  assert.equal(getStep(geojson, 220700, 'v5', 'step'), 2, 'Time 0 should correspond to step 2');
  assert.equal(getStep(geojson, 230700, 'v5', 'step'), 2, 'Time 0 should correspond to step 2');

  var step0lon = geojson.routes[0].legs[0].steps[0].maneuver.location[0];
  var step0lat = geojson.routes[0].legs[0].steps[0].maneuver.location[1];
  var step1lon = geojson.routes[0].legs[0].steps[1].maneuver.location[0];
  var step1lat = geojson.routes[0].legs[0].steps[1].maneuver.location[1];
  var step2lon = geojson.routes[0].legs[0].steps[2].maneuver.location[0];
  var step2lat = geojson.routes[0].legs[0].steps[2].maneuver.location[1];
  var step3lon = geojson.routes[0].legs[0].steps[3].maneuver.location[0];
  var step3lat = geojson.routes[0].legs[0].steps[3].maneuver.location[1];

  assert.ok(Math.abs(getStep(geojson, 0, 'v5', 'coords').geometry.coordinates[0] - step0lon) < 0.00001 &&
            Math.abs(getStep(geojson, 0, 'v5', 'coords').geometry.coordinates[1] - step0lat) < 0.00001, 'Time 0 should correspond to first coordinates');
  assert.ok(getStep(geojson, 46800, 'v5', 'coords').geometry.coordinates[0] < step0lon && getStep(geojson, 46800, 'v5', 'coords').geometry.coordinates[0] > step1lon &&
            getStep(geojson, 46800, 'v5', 'coords').geometry.coordinates[1] < step0lat && getStep(geojson, 46800, 'v5', 'coords').geometry.coordinates[1] > step1lat, 'Coordinates should fall into step 0');
  assert.ok(Math.abs(getStep(geojson, 47800, 'v5', 'coords').geometry.coordinates[0] - step1lon) < 0.00001 &&
            Math.abs(getStep(geojson, 47800, 'v5', 'coords').geometry.coordinates[1] - step1lat) < 0.00001, 'Time 47800 should correspond to second coordinates');
  assert.ok(getStep(geojson, 219700, 'v5', 'coords').geometry.coordinates[0] < step1lon && getStep(geojson, 219700, 'v5', 'coords').geometry.coordinates[0] > step2lon &&
            getStep(geojson, 219700, 'v5', 'coords').geometry.coordinates[1] < step1lat && getStep(geojson, 219700, 'v5', 'coords').geometry.coordinates[1] > step2lat, 'Coordinates should fall into step 1');

  assert.ok(Math.abs(getStep(geojson, 220700, 'v5', 'coords').geometry.coordinates[0] - step2lon) < 0.00001 &&
            Math.abs(getStep(geojson, 220700, 'v5', 'coords').geometry.coordinates[1] - step2lat) < 0.00001, 'Time 220700 should correspond to third coordinates');
  assert.ok(getStep(geojson, 230700, 'v5', 'coords').geometry.coordinates[0] < step2lon && getStep(geojson, 230700, 'v5', 'coords').geometry.coordinates[0] > step3lon &&
            getStep(geojson, 230700, 'v5', 'coords').geometry.coordinates[1] < step2lat && getStep(geojson, 230700, 'v5', 'coords').geometry.coordinates[1] > step3lat, 'Coordinates should fall into step 2');
  assert.end();
});