var test = require('tape');
var validate = require('../lib/validate.js').validate;
var v4 = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
var v5 = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
var responses = [ v4, v5 ];

test('Tests style ID validation', function (assert) {
  var bad1 = [ null, undefined, false, '', 0 ];
  var bad2 = [ 'mapbox://fake-styles/' ];
  var good = [ v4.style, v5.style ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].style = e; assert.throws(function() { validate(responses[i]); }, /{style} is required and must be a string/ ); });
    bad2.forEach(function (e) { responses[i].style = e; assert.throws(function() { validate(responses[i]); }, /{style} must start with mapbox:\/\/styles\// ); });
    good.forEach(function (e) { responses[i].style = e; assert.doesNotThrow(function() { validate(responses[i]); }); });   
  }
  assert.end();
});

test('Tests route validation', function (assert) {
  var bad1 = [ null, undefined, false, '', 0 ];
  var bad2 = [ {}, { 'routes': [] }, { 'wapoints': [] } ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].route = e; assert.throws(function() { validate(responses[i]); }, /{route} is required and must be an object/ ); });
    bad2.forEach(function (e) { responses[i].route = e; assert.throws(function() { validate(responses[i]); }, /{route} must be a directions API response/ ); });
  }

  v4.route = {'routes':[],'waypoints':[]} ; assert.doesNotThrow(function() { validate(v4); });
  v5.route = {'code':'ok','routes':[],'waypoints':[]} ; assert.doesNotThrow(function() { validate(v5); });
  assert.end();
});

test('Tests spacing', function (assert) {
  var bad1 = [ null, false, 0 ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].spacing = e; assert.throws(function() { validate(responses[i]); }, /{spacing}, if specified, must be a string/ ); });
  }

  var bad2 = [ 'string', 'acceldecel' ];
  var good = [ '', 'constant' ];
  bad2.forEach(function (e) { v4['spacing'] = e; assert.throws(function() { validate(v4); }, /{spacing}, if specified, must either be null or constant for v4 directions responses/ ); });
  good.forEach(function (e) { v4['spacing'] = e; assert.doesNotThrow(function() { validate(v4); }); });

  bad2 = [ 'string' ];
  good = [ '', 'constant', 'acceldecel' ];
  bad2.forEach(function (e) { v5['spacing'] = e; assert.throws(function() { validate(v5); }, /{spacing}, if specified, must either be null, constant, or acceldecel for v5 directions responses/ ); });
  good.forEach(function (e) { v5['spacing'] = e; assert.doesNotThrow(function() { validate(v5); }); });
  assert.end();
});

test('Tests zoom validation', function (assert) {
  var bad1 = [ null, undefined, false, '', '0' ];
  var bad2 = [ -1, 21 ];
  var good = [ 0, 20 ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].zoom = e; assert.throws(function() { validate(responses[i]); }, /{zoom} is required and must be a number/ ); });
    bad2.forEach(function (e) { responses[i].zoom = e; assert.throws(function() { validate(responses[i]); }, /{zoom} must be between 0 and 20/ ); });
    good.forEach(function (e) { responses[i].zoom = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
  }
  assert.end();
});

test('Tests pitch validation', function (assert) {
  var bad1 = [ null, undefined, false, '', '0' ];
  var bad2 = [ -1, 61 ];
  var good = [ 0, 60 ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].pitch = e; assert.throws(function() { validate(responses[i]); }, /{pitch} is required and must be a number/ ); });
    bad2.forEach(function (e) { responses[i].pitch = e; assert.throws(function() { validate(responses[i]); }, /{pitch} must be between 0 and 60/ ); });
    good.forEach(function (e) { responses[i].pitch = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
  }
  assert.end();
});

test('Tests timestamp validation', function (assert) {
  var bad1 = [ null, undefined, false, '', 0 ];
  var bad2 = [ '123', '123a' ];
  var good = [ '12h34m56s', '34m56s12h', '1m', '1m30s', 's' ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].time = e; assert.throws(function() { validate(responses[i]); }, /{time} is required and must be a string/ ); });
    bad2.forEach(function (e) { responses[i].time = e; assert.throws(function() { validate(responses[i]); }, /{time} must have a #a format where a can be h, m, or s/ ); });
    good.forEach(function (e) { responses[i].time = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
  }
  assert.end();
});

test('Tests speed validation', function (assert) {
  var bad1 = [ null, undefined, false, '', 0 ];
  var bad2 = [ '123', '123a' ];
  var good = [ '1x', '0.5x' ];
  for (var i = 0; i < responses.length; i++) {
    bad1.forEach(function (e) { responses[i].speed = e; assert.throws(function() { validate(responses[i]); }, /{speed} is required and must be a string/ ); });
    bad2.forEach(function (e) { responses[i].speed = e; assert.throws(function() { validate(responses[i]); }, /{speed} must have a #x format/ ); });
    good.forEach(function (e) { responses[i].speed = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
  }
  assert.end();
});

test('Tests maneuver validation', function (assert) {
  var v4test = JSON.parse(JSON.stringify(v4));
  var v5test = JSON.parse(JSON.stringify(v5));
  delete v4test['maneuvers'];
  delete v5test['maneuvers'];
  assert.throws(function() { validate(v4test); }, /{maneuvers} is required and must be an array/);
  assert.throws(function() { validate(v5test); }, /{maneuvers} is required and must be an array/);
  v4test['maneuvers'] = v5test['maneuvers'] = '';
  assert.throws(function() { validate(v4test); }, /{maneuvers} is required and must be an array/);
  assert.throws(function() { validate(v5test); }, /{maneuvers} is required and must be an array/);
  assert.doesNotThrow(function() { validate(v4); });
  assert.doesNotThrow(function() { validate(v5); });
  assert.end();
});

test('Tests maneuver type validation', function (assert) {
  var bad1 = [ null, undefined, '', 0, 'string' ];
  var good = [ [], ['turn', 'merge'] ];
  for (var i = 0; i < responses.length; i++) {
    for (var j = 0; j < responses[i].maneuvers.length; j++) {
      bad1.forEach(function (e) { responses[i].maneuvers[j].type = e; assert.throws(function() { validate(responses[i]); }, /{maneuver type} is required and must be an array/ ); });
      good.forEach(function (e) { responses[i].maneuvers[j].type = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
    }
  }
  v4 = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  assert.end();
});

test('Tests maneuver modifier validation', function (assert) {
  var bad1 = [ null, undefined, '', 0, 'string' ];
  var good = [ [], ['slight left', 'slight right'] ];
  for (var i = 0; i < v5.maneuvers.length; i++) {
    bad1.forEach(function (e) { v5.maneuvers[i].modifier = e; assert.throws(function() { validate(v5); }, /{maneuver modifier} is required and must be an array/ ); });
    good.forEach(function (e) { v5.maneuvers[i].modifier = e; assert.doesNotThrow(function() { validate(v5); }); });
  }

  var all = [ null, '', 0, 'string', [],['left, right'] ];
  for (var j = 0; j < v4.maneuvers.length; j++) {
    all.forEach(function (e) { v4.maneuvers[j].modifier = e; assert.throws(function() { validate(v4); }, /{maneuver modifier} is not a property in v4 directions responses/ ); });
  }
  assert.end();
});

test('Tests maneuver buffer validation', function (assert) {
  var bad1 = [ null, undefined, false, '', '0' ];
  var bad2 = [ -1 ];
  var good = [ 0, 0.10 ];
  for (var i = 0; i < responses.length; i++) {
    for (var j = 0; j < responses[i].maneuvers.length; j++) {
      bad1.forEach(function (e) { responses[i].maneuvers[j].buffer = e; assert.throws(function() { validate(responses[i]); }, /{maneuver buffer} is required and must be a number/ ); });
      bad2.forEach(function (e) { responses[i].maneuvers[j].buffer = e; assert.throws(function() { validate(responses[i]); }, /{maneuver buffer} must be greater than or equal to 0/ ); });
      good.forEach(function (e) { responses[i].maneuvers[j].buffer = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
    }
  }
  assert.end();
});

test('Tests maneuver zoom validation', function (assert) {
  var bad1 = [ null, undefined, false, '', '0' ];
  var bad2 = [ -1, 21 ];
  var good = [ 0, 20 ];
  for (var i = 0; i < responses.length; i++) {
    for (var j = 0; j < responses[i].maneuvers.length; j++) {
      bad1.forEach(function (e) { responses[i].maneuvers[j].zoom = e; assert.throws(function() { validate(responses[i]); }, /{maneuver zoom} is required and must be a number/ ); });
      bad2.forEach(function (e) { responses[i].maneuvers[j].zoom = e; assert.throws(function() { validate(responses[i]); }, /{maneuver zoom} must be between 0 and 20/ ); });
      good.forEach(function (e) { responses[i].maneuvers[j].zoom = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
    }
  }
  assert.end();
});

test('Tests maneuver pitch validation', function (assert) {
  var bad1 = [ null, undefined, false, '', '0' ];
  var bad2 = [ -1, 61 ];
  var good = [ 0, 60 ];
  for (var i = 0; i < responses.length; i++) {
    for (var j = 0; j < responses[i].maneuvers.length; j++) {
      bad1.forEach(function (e) { responses[i].maneuvers[j].pitch = e; assert.throws(function() { validate(responses[i]); }, /{maneuver pitch} is required and must be a number/ ); });
      bad2.forEach(function (e) { responses[i].maneuvers[j].pitch = e; assert.throws(function() { validate(responses[i]); }, /{maneuver pitch} must be between 0 and 60/ ); });
      good.forEach(function (e) { responses[i].maneuvers[j].pitch = e; assert.doesNotThrow(function() { validate(responses[i]); }); });
    }
  }
  assert.end();
});
