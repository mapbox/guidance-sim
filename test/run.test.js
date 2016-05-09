var test = require('tape');
var run = require('../index.js').simulate;

test('Tests run function', function (assert) {
  var map = {};
  map.setCenter = function (center) {
    assert.ok(Math.abs(center[0] - (-105.58226883430387)) < 0.0000001 && Math.abs(center[1] - (40.3660567903361)) < 0.0000001, 'map.setCenter is within reasonable distance of coordinates at 30 seconds into route');
  };
  map.easeTo = function (object) {
    assert.ok(typeof object === 'object' && object.center && object.bearing !== undefined && object.duration && object.pitch && object.zoom && object.easing, 'map.easeTo is called with objects that contain the expected params');
  };

  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  var response = run(map, config);
  var responses = [];
  response.on('update', function(data) {
    if (responses.length < 5) {
      responses.push(data);
    } else {
      clearInterval(response.interval);
      responses.forEach(function(res) {
        assert.ok(35 < res.pitch < 40, 'Pitch property should exist and should be between 35 and 40');
        assert.ok(17 < res.zoom < 17.5, 'Zoom property should exist and should be between 17 and 17.5');
      });
    }
  });
  assert.end();
});

test('Tests run function', function (assert) {
  var map = {};
  map.setCenter = function (center) {
    assert.ok(Math.abs(center[0] - (-105.58380889477377)) < 0.0000001 && Math.abs(center[1] - (40.36600447188571)) < 0.0000001, 'map.setCenter is within reasonable distance of coordinates at 30 seconds into route');
  };
  map.easeTo = function (object) {
    assert.ok(typeof object === 'object' && object.center && object.bearing !== undefined && object.duration && object.pitch && object.zoom && object.easing, 'map.easeTo is called with objects that contain the expected params');
  };

  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  config['spacing'] = 'acceldecel';
  var response = run(map, config);
  var responses = [];
  response.on('update', function(data) {
    if (responses.length < 5) {
      responses.push(data);
    } else {
      clearInterval(response.interval);
      responses.forEach(function(res) {
        assert.ok(35 < res.pitch < 40, 'Pitch property should exist and should be between 35 and 40');
        assert.ok(17 < res.zoom < 17.5, 'Zoom property should exist and should be between 17 and 17.5');
        assert.ok(Math.abs(14.21082472218207 - res.speed) < 0.0000001, 'Speed is within reasonable threshold of expected value');
      });
    }
  });
  assert.end();
});