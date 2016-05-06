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
    assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.0000001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.0000001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');
    
    var longitude1 = -105.5823163485612;
    var latitude1 = 40.36592096419095;
    var bearing1 = -115.51327151595866;
    assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.0000001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.0000001, 'map.easeTo called for step #2 with bearing within reasonable threshold of expected');
   
    var longitude2 = -105.58238848370145;
    var latitude2 = 40.365895686185645;
    var bearing2 = -114.69872768409871;
    assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.0000001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.0000001, 'map.easeTo called for step #3 with bearing within reasonable threshold of expected');
    
    var longitude3 = -105.58246150286853;
    var latitude3 = 40.36587186433704;
    var bearing3 = -113.1796410747505;
    assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.0000001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of expected');
    
    var longitude4 = -105.5825351298541;
    var latitude4 = 40.36584919354879;
    var bearing4 = -112.00493412525029;
    assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.0000001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of expected');
    assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of expected');

    for (var i = 0; i < responses.length; i++) {
      assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
      assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
      assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
    }
  }

  assert.end();
});

// test('Tests simulate function', function (assert) {
//   var map = {};
//   var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
//   var version = 'v5';

//   map.setCenter = function (center) {
//     assert.deepEqual(center, [ -105.582374, 40.365898 ], 'map.setCenter called with first coordinate in route linestring');
//   };

//   var response = simulate(map, config, version);
//   var responses = [];
//   map.easeTo = function (object) {
//     if (responses.length < 5) {
//       responses.push(object);
//     } else {
//       clearInterval(response.interval);
//       easeToTest(responses);
//     }
//   };

//   function easeToTest (responses) {
//     var longitude0 = -105.582374;
//     var latitude0 = 40.365898;
//     var bearing0 = 0;
//     assert.ok(Math.abs(responses[0].center[0] - longitude0) <= 0.0000001 && Math.abs(responses[0].center[1] - latitude0) <= 0.00001, 'map.easeTo called for step #1 with center within reasonable threshold of -105.583769,40.365675');
//     assert.ok(Math.abs(responses[0].bearing - bearing0) <= 0.0000001, 'map.easeTo called for step #1 with bearing within reasonable threshold of 0');
    
//     var longitude1 = -105.582495;
//     var latitude1 = 40.365863;
//     var bearing1 = -88.6329770838254;
//     assert.ok(Math.abs(responses[1].center[0] - longitude1) <= 0.0000001 && Math.abs(responses[1].center[1] - latitude1) <= 0.00001, 'map.easeTo called for step #2 with center within reasonable threshold of -105.5838439318794,40.365676362409125');
//     assert.ok(Math.abs(responses[1].bearing - bearing1) <= 0.0000001, 'map.easeTo called for step #2 with bearing within reasonable threshold of -88.6329770838254');
   
//     var longitude2 = -105.58391882532591;
//     var latitude2 = 40.36567832752468;
//     var bearing2 = -88.02763348689591;
//     assert.ok(Math.abs(responses[2].center[0] - longitude2) <= 0.0000001 && Math.abs(responses[2].center[1] - latitude2) <= 0.00001, 'map.easeTo called for step #3 with center within reasonable threshold of -105.58391882532591,40.36567832752468');
//     assert.ok(Math.abs(responses[2].bearing - bearing2) <= 0.0000001, 'map.easeTo called for step #3 with bearing within reasonable threshold of -88.02763348689591');
    
//     var longitude3 = -105.58399368496539;
//     var latitude3 = 40.36568082283482;
//     var bearing3 = -87.49496514567676;
//     assert.ok(Math.abs(responses[3].center[0] - longitude3) <= 0.0000001 && Math.abs(responses[3].center[1] - latitude3) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58399368496539,40.36568082283482');
//     assert.ok(Math.abs(responses[3].bearing - bearing3) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -87.49496514567676');
    
//     var longitude4 = -105.58406843278878;
//     var latitude4 = 40.36568530592743;
//     var bearing4 = -85.49912942979803;
//     assert.ok(Math.abs(responses[4].center[0] - longitude4) <= 0.0000001 && Math.abs(responses[4].center[1] - latitude4) <= 0.00001, 'map.easeTo called for step #4 with center within reasonable threshold of -105.58406843278878,40.36568530592743');
//     assert.ok(Math.abs(responses[4].bearing - bearing4) <= 0.0000001, 'map.easeTo called for step #4 with bearing within reasonable threshold of -85.49912942979803');

//     for (var i = 0; i < responses.length; i++) {
//       assert.equal(responses[i].duration, 1000, 'map.easeTo called for each step with duration at 1000');
//       assert.ok(35 < responses[i].pitch < 40, 'map.easeTo called for each step with pitch between 35 and 40');
//       assert.ok(17 < responses[i].zoom < 17.5, 'map.easeTo called for each step with zoom between 17 and 17.5');
//     }
//   }
//   assert.end();
// });

// test('Tests simulate function', function (assert) {
//   var map = {};
//   var config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
//   config['spacing'] = 'acceldecel';
//   var version = 'v5';

//   map.setCenter = function (center) {
//     assert.deepEqual(center, [ -105.583769, 40.365675 ], 'map.setCenter called with first coordinate in route linestring');
//   };

//   var response = simulate(map, config, version);
//   var responses = [];
//   map.easeTo = function (object) {
//     if (responses.length < 5) {
//       responses.push(object);
//     } else {
//       clearInterval(response.interval);
//       easeToTest(responses);
//     }
//   };

//   function easeToTest (responses) {
//     var expected = 17 - ( 14.21082472218207 - 30 ) / 70;
//     for (var i = 0; i < responses.length; i++) {
//       assert.ok(Math.abs(expected - responses[i].zoom) < 0.0000001, 'Calculated zoom is within reasonable threshold of expected zoom');
//     }
//   }
//   assert.end();
// });