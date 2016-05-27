[![Build Status](https://secure.travis-ci.org/mapbox/guidance-sim.png)](https://travis-ci.org/mapbox/guidance-sim)

guidance-sim
----
A project to simulate guidance routes using [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) from [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions) responses.

### Simulating a Mapbox Directions Guidance Route

```js
var simulate = require('guidance-sim').simulate;
var configuration = require('./configuration.json');

var map = new mapboxgl.Map({
    // desired map options
});
map.on('style.load', function () {
    simulate(map, configuration);
});
```

#### Parameters

-   `map` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Mapbox GL [map object](https://www.mapbox.com/mapbox-gl-js/api/#Map)
-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration parameters, which include the following:

| parameter | required | type | default value | notes |
| --- | --- | --- | --- | --- |
| `style` | Yes | String | `mapbox://styles/mapbox/streets-v8` | Style ID provided by Mapbox Studio |
| `route` | Yes | Object | --- | Mapbox Directions v4 or v5 API response |
| `spacing` | No | String | `constant` | <ul><li>`constant` assumes a constant speed throughout playback</li><li>`acceldecel` assumes an average speed per route step</li></ul> |
| `zoom` | Yes | Number | `17` | <ul><li>If `spacing`:`constant` - zoom when not maneuvering</li><li>If `spacing`:`acceldecel` - zoom at 30mph</li></ul> |
| `pitch` | Yes | Number | `45` | Pitch when not maneuvering |
| `timestamp` | Yes | String | `00h00m00s` | Route simulation playback start time |
| `speed` | Yes | String | `1x` | Route simulation playback speed |
| `maneuvers` | Yes | Object | --- | Specifies desired `buffer` (miles), `zoom`, and `pitch` for each maneuver |

The `maneuvers` configuration parameter provides the simulator alternative map parameters when approaching and exiting a maneuver. The following configuration will ease sinusoidally from a pitch of 40° to 35° and zoom of 17 to 17.5 beginning 0.10 miles away from any turns, and ease back to the default values over 0.10 miles afterwards:

```js
{
    'zoom': 17,
    'pitch': 40,
    'maneuvers': [
        {
          "type": [
            "turn right",
            "turn left"
          ],
          "buffer": 0.10,
          "zoom": 17.5,
          "pitch": 35
        }
    ]
}
```

#### Example

```sh
npm start
# --> http://localhost:9966/
```

### Creating a Configuration File

```sh
npm run configure
```

This script generates a starter configuration file for running a simulation. You will be prompted to provide inputs for parameters. Default parameters, presented in magenta text, will be automatically configured if you press `[ENTER]`` without specifying a value.

If there are errors, the script will print the first error it encountered. If there are no errors, a configuration file should be created at the specified filepath (i.e., first input provided).

#### Additional Notes

A `maneuver` array will be automatically added to your configuration file. Please see the explanation above for maneuver object specifications.

For Directions v5 API responses, maneuvers have an additional `modifiers` field. If a maneuver `type` is specified but no `modifiers`, it is assumed that the rule should be applied to all `modifier` values. The exception to this is if a `modifier` is specified for the same `type` in another maneuver object. In this scenario, the more specific configuration takes precendence.

### Validating a Configuration File

```sh
npm run validate
```

This script validates the configuration file. You will be prompted to provide the filepath of the file you'd like to validate. The default directory is the main directory.

If there are errors, the script will print the first error it encounters. If there are no errors, the script will print the JSON-formatted configuration file contents back into the terminal.

### Seeking to a Different Point in the Simulation

This function runs the Emitter.stepsTaken function from [guidance-replay](https://github.com/mapbox/guidance-replay)
using the start time determined by the user in the configuration file.

```js
var Emitter = require('guidance-replay').Emitter;
var route = require('guidance-replay').route;
var stepsTaken = require('guidance-sim').stepsTaken;

var configuration = require('./configuration.json');
var emitter = new Emitter(route(configuration.route), 1000);
var seek = 10000 // desired seek time in milliseconds

stepsTaken(emitter, seek);
```

#### Parameters

-   `emitter` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** An event emitter object coming off the [`Emitter` function in `guidance-replay`](https://github.com/mapbox/guidance-replay#emitter)
-   `scrub` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Desired start time in milliseconds.

### Adjusting Simulation Speed

This function clears the current interval and reinitializes a new interval using a new speed value.

```js
var setSpeed = require('guidance-sim').setSpeed;

var map = new mapboxgl.Map({
    // desired map options
});
map.on('style.load', function () {
    var response = simulate(map, configuration);
    response.on('update', function(data) {
      var newSpeed = 500;
      response.interval = setSpeed(response, response.interval, newSpeed, data.options.frequency);
    })
});
```

#### Parameters

-   `response` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** An EventEmitter object
-   `interval` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** An interval ID
-   `speed` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The duration in milliseconds over which to ease the map to the new location
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Map options from initialization; see [`simulate.js` L62:71](https://github.com/mapbox/guidance-sim/blob/2f1b567101a5b00e00e933f0b2c8a7181b4ec74a/lib/simulate.js#L62-L71) for more information

### Test

```
npm test
```