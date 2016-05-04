var test = require('tape');

var seek = require('../lib/simulate').seek;
var getManeuverParams = require('../lib/simulate').getManeuverParams;
var modifyParams = require('../lib/simulate').modifyParams;
var calculateParams = require('../lib/simulate').calculateParams;
var zoomBySpeed = require('../lib/simulate').zoomBySpeed;

var config;
var version;
var expected;
var steps;

test('seek', function (assert) {
  var route;
  var start;

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  route = JSON.parse(JSON.stringify(require('./fixtures/route.v4.test.json')));
  expected = 21;
  start = seek(config, route);
  assert.equal(start, expected, 'Should equal 21');

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  route = JSON.parse(JSON.stringify(require('./fixtures/route.v5.test.json')));
  expected = 13;
  start = seek(config, route);
  assert.equal(start, expected, 'Should equal 13');
  assert.end();
});

test('getManeuverParams & modifyParams', function (assert) {
  var maneuvers;
  var response;

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  version = 'v4';
  steps = JSON.parse(JSON.stringify(require('./fixtures/steps.v4.test.json')));
  maneuvers = JSON.parse(JSON.stringify(require('./fixtures/maneuvers.v4.test.json')));
  for (var i = 0; i < steps.length; i++) {
    response = modifyParams(config, version, steps[i], maneuvers);
    modified = getManeuverParams(config, version, steps[i], maneuvers);
    if (i < 3) {
      assert.equal(typeof response, 'object', 'The second two steps should return an object');
      assert.ok(response.type.indexOf('turn left') !== -1, 'The maneuver type response should contain \'turn left\' as an option');
      assert.ok(17 <= response.zoom && modified.zoom <= 17.5, 'The zoom level should be between 17 and 17.5');
      assert.ok(35 <= response.pitch && modified.pitch <= 40, 'Pitch should be between 35 and 40');
    } else {
      assert.equal(response, undefined, 'The first two steps are not within the buffer zone of a maneuver');
      assert.equal(modified.zoom, 17, 'Zoom should be exactly 17');
      assert.equal(modified.pitch, 40, 'Pitch should be exactly 40');
    }
  }

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  version = 'v5';
  steps = JSON.parse(JSON.stringify(require('./fixtures/steps.v5.test.json')));
  maneuvers = JSON.parse(JSON.stringify(require('./fixtures/maneuvers.v5.test.json')));
  for (var j = 0; j < steps.length; j++) {
    response = modifyParams(config, version, steps[j], maneuvers);
    modified = getManeuverParams(config, version, steps[j], maneuvers);
    if (j < 2) {
      assert.equal(response, undefined, 'The first two steps are not within the buffer zone of a maneuver');
      assert.equal(modified.zoom, 17, 'Zoom should be exactly 17');
      assert.equal(modified.pitch, 40, 'Pitch should be exactly 40');
    } else {
      assert.equal(typeof response, 'object', 'The second two steps should return an object');
      assert.ok(response.type.indexOf('turn') !== -1, 'The maneuver type response should contain \'turn\' as an option');
      assert.ok(response.modifier.indexOf('left') !== -1, 'The maneuver modifier should contain \'left\' as an option');
      assert.ok(17 <= response.zoom && modified.zoom <= 17.5, 'The zoom level should be between 17 and 17.5');
      assert.ok(35 <= response.pitch && modified.pitch <= 40, 'Pitch should be between 35 and 40');
    }
  }

  assert.end();
});

test('calculateParams', function (assert) {
  var zooms;
  var pitches;
  var zoom;
  var pitch;

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  var min = [ 0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00 ];
  var maneuver = 0;
  zooms = [];
  pitches = [];
  for (var i = 0; i < min.length; i++) {
    zoom = calculateParams(config, maneuver, min[i], 'zoom');
    zooms.push(zoom);
    pitch = calculateParams(config, maneuver, min[i], 'pitch');
    pitches.push(pitch);
  }
  for (var j = 0; j < 5; j++) {
    assert.ok(zooms[j + 1] - zooms[j] < zooms[j + 2] - zooms[j + 1], 'Should be sinusoidal');
    assert.ok(pitches[j + 1] - pitches[j] > pitches[j + 2] - pitches[j + 1], 'Should be sinusoidal');
  }
  for (var k = 6; k < 9; k++) {
    assert.ok(zooms[k + 1] - zooms[k] > zooms[k + 2] - zooms[k + 1], 'Should be sinusoidal');
    assert.ok(pitches[k + 1] - pitches[k] < pitches[k + 2] - pitches[k + 1], 'Should be sinusoidal');
  }

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  zooms = [];
  pitches = [];
  for (var l = 0; l < min.length; l++) {
    zoom = calculateParams(config, maneuver, min[l], 'zoom');
    zooms.push(zoom);
    pitch = calculateParams(config, maneuver, min[l], 'pitch');
    pitches.push(pitch);
  }
  for (var m = 0; m < 5; m++) {
    assert.ok(zooms[m + 1] - zooms[m] < zooms[m + 2] - zooms[m + 1], 'Should be sinusoidal');
    assert.ok(pitches[m + 1] - pitches[m] > pitches[m + 2] - pitches[m + 1], 'Should be sinusoidal');
  }
  for (var n = 6; n < 9; n++) {
    assert.ok(zooms[n + 1] - zooms[n] > zooms[n + 2] - zooms[n + 1], 'Should be sinusoidal');
    assert.ok(pitches[n + 1] - pitches[n] < pitches[n + 2] - pitches[n + 1], 'Should be sinusoidal');
  }
  assert.end();
});

test('zoomBySpeed', function (assert) {
  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  config['spacing'] = 'acceldecel';
  steps = JSON.parse(JSON.stringify(require('./fixtures/steps.v5.test.json')));
  expected = 17 - ( 14.21082472218207 - 30 ) / 70;
  for (var i = 0; i < steps.length; i++) {
    assert.ok(Math.abs(expected - zoomBySpeed(config, steps[i])) < 0.0000001, 'Calculated zoom is within reasonable threshold of expected zoom');
  }
  assert.end();
});
