var test = require('tape');
var simulate = require('../index.js').simulate;

test('Tests simulate function', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  var version = 'v4';

  map.setCenter = function (center) {
    assert.deepEqual(center, [ -105.582209, 40.36596 ], 'map.setCenter called with first coordinate in route linestring'); 
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
    var longitude0 = -105.582209;
    var latitude0 = 40.36596;
    var bearing0 = 0;
    assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.0000001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of -105.585181,40.365692');
    assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.0000001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');
    
    var longitude1 = -105.58228066126962;
    var latitude1 = 40.36593394139349;
    var bearing1 = -115.51327151208723;
    assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.0000001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of -105.58522368847119,40.36559572388816');
    assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.0000001, 'map.easeTo called for step #2 with bearing within reasonable threshold of -115.51327151208723');
   
    var longitude2 = -105.58235232248381;
    var latitude2 = 40.365907882742746;
    var bearing2 = -115.51331794183936;
    assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.0000001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of -105.58526530547272,40.365499157826925');
    assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.0000001, 'map.easeTo called for step #3 with bearing within reasonable threshold of -115.51331794183936');
    
    var longitude3 = -105.58242513932977;
    var latitude3 = 40.36588372762338;
    var bearing3 = -113.52718801898948;
    assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.0000001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58529891525747,40.365401033898515');
    assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -113.52718801898948');
    
    var longitude4 = -105.58249815847094;
    var latitude4 = 40.365859905751705;
    var bearing4 = -113.17966483450002;
    assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.0000001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.585306,40.365309');
    assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -113.17966483450002');

    for (var i = 0; i < responses.length; i++) {
      assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
      assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
      assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
    }
  }

  assert.end();
});

test('Tests simulate function', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  var version = 'v5';

  map.setCenter = function (center) {
    assert.deepEqual(center, [ -105.583769, 40.365675 ], 'map.setCenter called with first coordinate in route linestring');
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
    var longitude0 = -105.583769;
    var latitude0 = 40.365675;
    var bearing0 = 0;
    assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.0000001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of -105.583769,40.365675');
    assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.0000001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');
    
    var longitude1 = -105.5838439318794;
    var latitude1 = 40.365676362409125;
    var bearing1 = -88.6329770838254;
    assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.0000001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of -105.5838439318794,40.365676362409125');
    assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.0000001, 'map.easeTo called for step #2 with bearing within reasonable threshold of -88.6329770838254');
   
    var longitude2 = -105.58391882532591;
    var latitude2 = 40.36567832752468;
    var bearing2 = -88.02763348689591;
    assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.0000001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of -105.58391882532591,40.36567832752468');
    assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.0000001, 'map.easeTo called for step #3 with bearing within reasonable threshold of -88.02763348689591');
    
    var longitude3 = -105.58399368496539;
    var latitude3 = 40.36568082283482;
    var bearing3 = -87.49496514567676;
    assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.0000001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58399368496539,40.36568082283482');
    assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -87.49496514567676');
    
    var longitude4 = -105.58406843278878;
    var latitude4 = 40.36568530592743;
    var bearing4 = -85.49912942979803;
    assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.0000001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58406843278878,40.36568530592743');
    assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -85.49912942979803');

    for (var i = 0; i < responses.length; i++) {
      assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
      assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
      assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
    }
  }

  assert.end();
});

test('Tests simulate function', function (assert) {
  var map = {};
  var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  config['spacing'] = 'acceldecel';
  var version = 'v5';

  map.setCenter = function (center) {
    assert.deepEqual(center, [ -105.583769, 40.365675 ], 'map.setCenter called with first coordinate in route linestring');
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
      assert.ok(Math.abs(expected - responses[i].zoom) < 0.0000001, 'Calculated zoom is within reasonable threshold of expected zoom');
    }
  }
  assert.end();
});