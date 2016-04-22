var test = require('tape');
var util = require('../lib/util');

test('util.version', function (assert) {
  assert.equal(util.version({ 'code': 'Ok' }), 'v5');
  assert.equal(util.version({ 'fake': 'fake' }), 'v4');
  assert.end();
});

test('util.min', function (assert) {
  var array = [ 3.3, 2.2, 1.1 ];
  assert.equal(util.min(array), 1.1);
  assert.end();
});

test('util.timestamp', function (assert) {
  assert.equal(util.timestamp({ 'time': '00m00s' }), 0);
  assert.equal(util.timestamp({ 'time': '00m30s' }), 30000);
  assert.equal(util.timestamp({ 'time': '01m20s' }), 80000);
  assert.equal(util.timestamp({ 'time': '1m20s' }), 80000);
  assert.equal(util.timestamp({ 'time': '20s1m' }), 80000);
  assert.equal(util.timestamp({ 'time': '80s' }), 80000);
  assert.equal(util.timestamp({ 'time': '1m' }), 60000);
  assert.equal(util.timestamp({ 'time': '1h' }), 3600000);
  assert.end();
});

test('util.speed', function (assert) {
  assert.equal(util.speed({ 'speed': '1x' }, 1000), 1000);
  assert.equal(util.speed({ 'speed': '2x' }, 1000), 500);
  assert.equal(util.speed({ 'speed': '0.5x' }, 1000), 2000);
  assert.end();
});

test('util.isInteger', function (assert) {
  assert.equal(util.isInteger(1.0), 1);
  assert.equal(util.isInteger(1.1), 1.1);
  assert.equal(util.isInteger(1.11), 1.1);
  assert.end();
});

test('util.distanceConvert', function (assert) {
  assert.equal(util.distanceConvert(50,'km').toFixed(3)/1, 80.467);
  assert.equal(util.distanceConvert(50,'mi').toFixed(3)/1, 31.069);
  assert.end();
});
