var events = require('events').EventEmitter;
var setSpeed = require('../lib/setSpeed');
var test = require('tape');

test('Tests setSpeed', function (assert) {
  var response = new events();
  var interval = setInterval(function() {}, 1000);
  var options = JSON.parse(JSON.stringify(require('./fixtures/options.json')));
  setTimeout(function() {
    options.emitter.next = function () {};
    options.response.emit = function () {};
    interval = setSpeed(response, interval, 500, options);
    assert.equal(interval._idleTimeout && interval._idleNext.msecs, 500, 'Should be 500');
    interval = setSpeed(response, interval, 750, options);
    assert.equal(interval._idleTimeout && interval._idleNext.msecs, 750, 'Should be 750');
    interval = setSpeed(response, interval, 200, options);
    assert.equal(interval._idleTimeout && interval._idleNext.msecs, 200, 'Should be 200');
  }, 1000);
  clearInterval(interval);
  assert.end();
});