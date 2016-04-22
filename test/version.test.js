var test = require('tape');
var version = require('../lib/version');

test('Test version response', function (assert) {
  assert.equal(version('./test/fixtures/api.v4.test.json'), 'v4');
  assert.equal(version('./test/fixtures/api.v5.test.json'), 'v5');
  assert.end();
});
