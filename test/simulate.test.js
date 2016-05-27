var test = require('tape');
var simulate = require('../index.js').simulate;

test('Tests simulate & setMap functions for v4 responses', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  var version = 'v4';

  map.setCenter = function (center) {
    assert.ok(Math.abs(center[0] - (-105.58226883430387)) < 0.00001 && Math.abs(center[1] - (40.3660567903361)) < 0.00001, 'map.setCenter is within reasonable distance of coordinates at 30 seconds into route');
  };

  var response = simulate(map, config, version);
  var responses = [];
  map.easeTo = function (object) {
    if (responses.length < 5) {
      responses.push(object);
    } else {
      clearInterval(response.interval);
      easeToTest(responses);
    }
  };

  function easeToTest (responses) {
    var longitude0 = -105.5822446873192;
    var latitude0 = 40.36594702281948;
    var bearing0 = 0;
    assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.00001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.00001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');

    var longitude1 = -105.5823163485612;
    var latitude1 = 40.36592096419095;
    var bearing1 = -115.51329462754073;
    assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.00001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.00001, 'map.easeTo called for step #2 with bearing within reasonable threshold of expected');

    var longitude2 = -105.58238848370145;
    var latitude2 = 40.365895686185645;
    var bearing2 = -114.69872768409871;
    assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.00001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.00001, 'map.easeTo called for step #3 with bearing within reasonable threshold of expected');

    var longitude3 = -105.58246150286853;
    var latitude3 = 40.36587186433704;
    var bearing3 = -113.1796410747505;
    assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.00001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.00001, 'map.easeTo called for step #4 with bearing within reasonable threshold of expected');

    var longitude4 = -105.5825351298541;
    var latitude4 = 40.36584919354879;
    var bearing4 = -112.00493412525029;
    assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.00001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.00001, 'map.easeTo called for step #4 with bearing within reasonable threshold of expected');

    for (var i = 0; i < responses.length; i++) {
      assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
      assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
      assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
    }
  }

  assert.end();
});

test('Tests simulate & setMap functions for v5 responses', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  var version = 'v5';

  map.setCenter = function (center) {
    assert.ok(Math.abs(center[0] - (-105.58380889477377)) < 0.00001 && Math.abs(center[1] - (40.36600447188571)) < 0.00001, 'map.setCenter is within reasonable distance of coordinates at 30 seconds into route');
  };

  var response = simulate(map, config, version);
  var responses = [];
  map.easeTo = function (object) {
    if (responses.length < 5) {
      responses.push(object);
    } else {
      clearInterval(response.interval);
      easeToTest(responses);
    }
  };

  function easeToTest (responses) {
    var longitude0 = -105.58378121389613;
    var latitude0 = 40.36567522207599;
    var bearing0 = 0;

    assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.00001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of -105.583769,40.365675');
    assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.00001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');

    var longitude1 = -105.58385614577602;
    var latitude1 = 40.36567658447724;
    var bearing1 = -88.63298497761728;
    assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.00001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of -105.5838439318794,40.365676362409125');
    assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.00001, 'map.easeTo called for step #2 with bearing within reasonable threshold of -88.6329770838254');

    var longitude2 = -105.58393102744678;
    var latitude2 = 40.36567873426351;
    var bearing2 = -87.84211232828538;
    assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.00001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of -105.58391882532591,40.36567832752468');
    assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.00001, 'map.easeTo called for step #3 with bearing within reasonable threshold of -88.02763348689591');

    var longitude3 = -105.58400587601315;
    var latitude3 = 40.36568142642309;
    var bearing3 = -87.29723348598078;
    assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.00001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58399368496539,40.36568082283482');
    assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.00001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -87.49496514567676');

    var longitude4 = -105.58408061529192;
    var latitude4 = 40.36568606143033;
    var bearing4 = -85.34674227373826;
    assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.00001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58406843278878,40.36568530592743');
    assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.00001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -85.49912942979803');

    for (var i = 0; i < responses.length; i++) {
      assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
      assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
      assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
    }
  }
  assert.end();
});

test('Tests simulate & setMap functions for v5 responses in speedmode', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  config['spacing'] = 'acceldecel';
  var version = 'v5';

  map.setCenter = function (center) {
    assert.deepEqual(center, [ -105.58380889477377, 40.36600447188571 ], 'map.setCenter called with first coordinate in route linestring');
  };

  var response = simulate(map, config, version);
  var responses = [];
  map.easeTo = function (object) {
    if (responses.length < 5) {
      responses.push(object);
    } else {
      clearInterval(response.interval);
      easeToTest(responses);
    }
  };

  function easeToTest (responses) {
    var expected = 17 - ( 14.21082472218207 - 30 ) / 70;
    for (var i = 0; i < responses.length; i++) {
      assert.ok(Math.abs(expected - responses[i].zoom) < 0.00001, 'Calculated zoom is within reasonable threshold of expected zoom');
    }
  }
  assert.end();
});
