guidance-sim
----
A project to simulate guidance routes using [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) from [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions) responses.

```js
var guidanceSim = require('guidance-sim');

var map = new mapboxgl.Map({
    // desired map configurations
});
map.on('style.load', function () {
    guidanceSim(map, configuration);
});
```

### Simulating a Mapbox Directions Guidance Route

The guidance simulator requires 2 inputs:

* a Mapbox GL JS [`map` object](https://www.mapbox.com/mapbox-gl-js/api/#Map), and
* a configuration object with the following parameters:

| parameter | required | default value | notes |
| --- | --- | --- | --- |
| style | yes | `mapbox://styles/mapbox/streets-v8` | style ID provided by Mapbox Studio |
| route | yes | --- | Mapbox Directions v4 or v5 API response |
| spacing | no | `constant` | `acceldecel` may be configured for Mapbox Directions v5 API responses for dynamic playback rate |
| zoom | yes | `17` | <ul><li>If `spacing`:`constant` - zoom when not maneuvering</li><li>If `spacing`:`acceldecel` - zoom at 30mph</li></ul> |
| pitch | yes | `45` | pitch when not maneuvering |
| timestamp | yes | `00h00m00s` | route simulation playback start time |
| speed | yes | `1x` | route simulation playback speed |
| maneuvers | yes | --- | object specifying desired `buffer` (miles), `zoom`, and `pitch` for maneuvers |

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

### Test

```
npm test
```