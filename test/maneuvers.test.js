var test = require('tape');
var maneuvers = require('../lib/maneuvers');
var config;
var version;
var modified;
var expected;

test('maneuvers', function (assert) {
  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v4.test.json')));
  version = 'v4';
  modified = maneuvers(config, version);
  expected = { '-105.581712,40.366239': [ 'depart' ],
  '-105.581888,40.36608': [ 'bear right' ],
  '-105.585087,40.365885': [ 'turn left' ],
  '-105.585769,40.358648': [ 'turn right' ],
  '-105.590119,40.358023': [ 'arrive' ]
  };
  assert.deepEqual(modified, expected);

  config = JSON.parse(JSON.stringify(require('./fixtures/configuration.v5.test.json')));
  version = 'v5';
  modified = maneuvers(config, version);
  expected = {
    '-105.581675,40.366194': [ 'depart', undefined ],
    '-105.585075,40.365892': [ 'turn', 'left' ],
    '-105.586052,40.358819': [ 'turn', 'right' ],
    '-105.590121,40.358024': [ 'arrive', undefined ]
  };
  assert.deepEqual(modified, expected);
  assert.end();
});