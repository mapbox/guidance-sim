var Emitter = require('guidance-replay').Emitter;
var getRoute = require('guidance-replay').route;
var turfDistance = require('turf-distance');
var turfPoint = require('turf-point');
var util = require('./lib/util');
var getManeuvers = require('./lib/maneuvers');

/**
 * This function determines the directions API version and runs the simulator.
 * @name run
 * @param {Object} map Mapbox GL map object.
 * @param {Object} config Configuration parameters.
 * @param {string} config.style Mapbox style ID.
 * @param {Object} config.route Mapbox Directions API response. May be `v4` or `v5`.
 * @param {number} config.zoom Default zoom value.
 * @param {number} config.pitch Default pitch value.
 * @param {string} config.time Start time for simulation relative to route beginning.
 * @param {string} config.speed Route simulation speed.
 * @param {string} [config.spacing] Optional for v5 directions API responses.
 * `constant` will return a constant speed.
 * `acceldecl` will return dynamic speeds by route leg.
 * @param {Object} config.maneuvers Maneuver-specific parameters.
 * v4 directions API routes should have `type`, `buffer`, `zoom`, and `pitch`.
 * v5 directions API routes should have `type`, `modifier`, `buffer`, `zoom`, and `pitch`.
 * @returns {Object} Event emitter.
 */
module.exports = run;
function run (map, config) {
  var version = util.version(config.route);
  return simulate(map, config, version);
}

/**
 * This function produces a guidance simulation based on the provided route.
 * @name simulate
 * @param {Object} map Mapbox GL map object.
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {string} version Directions API version.
 * @returns {Object} Event emitter.
 */
module.exports.simulate = simulate;
function simulate (map, config, version) {
  var events = require('events').EventEmitter;
  var response = new events();
  // Retrieve maneuvers specified in configuration file
  var maneuvers = getManeuvers(config, version);
  // Retrieve a GeoJSON of the route
  var route = getRoute(config.route, { 'spacing': config.spacing });
  // Fast-forward if applicable
  route = seek(config, route);

  // Find the new first coordinate and center the map around it
  map.setCenter(route.geometry.coordinates[0]);

  // Set frequency and invoke the event emitter
  var frequency = 1000;
  var emitter = new Emitter(route, frequency);
  var speed = util.speed(config, frequency);
  var step = '';

  // At each interval, determine new parameters and ease map
  var interval = setInterval(function() {
    step = emitter.next();
    // If there are no remaining steps, clear the interval
    if (step === null) {
      response.emit(clearInterval(interval));
    } else {
      // Convert speed to miles per hour
      step['speed'] = util.distanceConvert(step['speed'], 'mi');
      var zoom;
      if (config.spacing === 'acceldecel') {
        // Calculate zoom as a function of speed
        zoom = zoomBySpeed(config, step);
      } else {
        // Calculate zoom as a function of proximity to next maneuver
        zoom = getManeuverParams(config, version, step, maneuvers, 'zoom');
      }
      // Calculate pitch as a function of proximity to next maneuver
      var pitch = getManeuverParams(config, version, step, maneuvers, 'pitch');
      map.easeTo({
        center: step.coords,
        bearing: step.bearing,
        duration: speed,
        pitch: pitch,
        zoom: zoom,
        easing: function (v) { return v; }
      });
      // Pass the new parameters back for display on the map
      response.emit('update', { pitch:pitch, zoom:zoom, speed:step.speed });
    }
  }, speed);
  response.interval = interval;
  return response;
}

/**
 * This function updates the route depending on the start time specified in the configuration.
 * @name seek
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {Object} route GeoJSON of the route with a `coordinatesProperties` property.
 * See https://github.com/mapbox/geojson-coordinate-properties for more information.
 * @returns {Object} GeoJSON of the route trimmed to configured start time.
 */
module.exports.seek = seek;
function seek (config, route) {
  var scrub = util.timestamp(config);
  var times = route.properties.coordinateProperties.times;
  for (var i = 0; i < times.length; i++) {
    if (scrub >= times[i] && scrub < times[i + 1]) {
      var seek = i;
    }
  }

  // Splice the route response for the following arrays on the seek value:
  // coordinates, speeds, times
  route.geometry.coordinates.splice(0,seek);
  route.properties.coordinateProperties.speeds.splice(0,seek);
  route.properties.coordinateProperties.times.splice(0,seek);

  // Calibrate the times array to 0ms for the first entry
  route.properties.coordinateProperties.times = route.properties.coordinateProperties.times.map(function (entry) { return entry - route.properties.coordinateProperties.times[0]; });
  return route;
}

/**
 * This function interprets the response from the `modifyParams` function.
 * If `zoom` or `pitch` is different due to a maneuver, it will return the modified parameters,
 * otherwise the default configuration parameters will be returned.
 * @name getManeuverParams
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {string} version Directions API version.
 * @param {Object} step Emitter events.
 * @param {array} step.coords Step coordinates.
 * @param {number} step.bearing Step bearing.
 * @param {number} [step.speed] Optional step speed if `spacing`: `acceldecel`.
 * @param {number} [step.speedchange] Optional step speed difference from previous step
 * if `spacing`: `acceldecel`.
 * @param {Object} maneuvers All manuevers along a route.
 * See `getManeuvers` function for more information.
 * @param {string} property Parameter to query for. Should be `zoom` or `pitch`.
 * @results {number} `zoom` or `pitch`.
 */
module.exports.getManeuverParams = getManeuverParams;
function getManeuverParams (config, version, step, maneuvers, property) {
  var res = modifyParams(config, version, step, maneuvers);
  if (res === undefined) {
    return config[property];
  } else {
    return res[property];
  }
}

/**
 * This function determines the new `zoom` and `pitch` values for the simulator, depending
 * on proximity to a manuever.
 * @name modifyParams
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {string} version Directions API version.
 * @param {Object} step Emitter events.
 * See `getManeuverParams` function for more information.
 * @param {Object} maneuvers All manuevers along a route.
 * See `getManeuvers` function for more information.
 * @results {Object} Maneuver-based step parameters.
 * @results {Array<string>} result.type Maneuver type.
 * @results {number} result.buffer Distance from maneuver in miles.
 * @results {number} result.zoom Modified zoom.
 * @results {number} result.pitch Modified pitch.
 */
module.exports.modifyParams = modifyParams;
function modifyParams (config, version, step, maneuvers) {
  var distances = [];
  var key;
  // Update maneuver keys with distance between current step and each maneuver
  for (key in maneuvers) {
    if (maneuvers.hasOwnProperty(key)) {
      var longitude = Number(key.split(',')[0]);
      var latitude = Number(key.split(',')[1]);
      var maneuver = turfPoint([longitude, latitude]);
      var distance = turfDistance(maneuver, turfPoint(step['coords']), 'miles');
      distances.push(distance);
      if (version === 'v5') {
        maneuvers[key][2] = distance;        
      } else {
        maneuvers[key][1] = distance;
      }
    }
  }

  // Determine closest maneuver
  var min = util.min(distances);
  for (key in maneuvers) {
    var type;
    var threshold;
    var modified;
    if (version === 'v5') {
      if (maneuvers[key][2] === min) {
        // Grab the type and modifier for the closest maneuver
        type = maneuvers[key][0];
        var modifier = maneuvers[key][1];
        // Match the closest maneuver on the route to the maneuver parameters in the configuration
        for (var i = 0; i < config.maneuvers.length; i++) {
          if ((config.maneuvers[i].type.indexOf(type) >= 0 && config.maneuvers[i].modifier.indexOf(modifier) >= 0) || (config.maneuvers[i].type.indexOf(type) >= 0 && config.maneuvers[i].modifier == false)) {
            threshold = config.maneuvers[i].buffer;
            // If the step is within the upcoming maneuver's threshold, update the parameters
            if (min <= threshold) {
              modified = JSON.parse(JSON.stringify(config.maneuvers[i]));
              modified['pitch'] = calculateParams(config, i, min, 'pitch');
              modified['zoom'] = calculateParams(config, i, min, 'zoom');
              return modified;
            }
          }
        }
      }
    } else {
      // Do the exact same thing as we would do with a v5 directions API response
      // accounting for differences in response format
      if (maneuvers[key][1] === min) {
        type = maneuvers[key][0];
        for (var j = 0; j < config.maneuvers.length; j++) {
          if (config.maneuvers[j].type.indexOf(type) >= 0) {
            threshold = config.maneuvers[j].buffer;
            if (min <= threshold) {
              modified = JSON.parse(JSON.stringify(config.maneuvers[j]));
              modified['pitch'] = calculateParams(config, j, min, 'pitch');
              modified['zoom'] = calculateParams(config, j, min, 'zoom');
              return modified;
            }
          }
        }
      }
    }   
  }
}

/**
 * This function calculates a new property value based on a sinusoidal relationship to maneuver.
 * @name calculateParams
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {number} i Position of the closest maneuver in the configuration file.
 * @param {number} min Distance between current step and closest maneuver.
 * @param {string} property Parameter to query for. Should be `zoom` or `pitch`.
 * @results {number} Updated parameter value. Should be `zoom` or `pitch`.
 */
module.exports.calculateParams = calculateParams;
function calculateParams (config, i, min, property) {
  var distance = 1 - (min / config.maneuvers[i]['buffer']);
  var percentToManeuver = 0.5 + 0.5 * Math.sin(Math.PI * (distance - 0.5));
  var response = config[property] + (percentToManeuver * (config.maneuvers[i][property] - config[property]));
  return response;
}

/**
 * This function calculates zoom based on speed.
 * Requires a v5 directions API response and `spacing`: `acceldecel` in configuration.
 * Assumes that default zoom level specified in configuration is for when simulation is at 30mph.
 * Zoom will adjust according to speed. Based on this relationship, a simulation with a speed of
 * 100mph will be presented at default zoom minus 1.
 * @name zoomBySpeed
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {Object} step Emitter events.
 * See `getManeuverParams` function for more information.
 * @results {number} Updated zoom value.
 */
module.exports.zoomBySpeed = zoomBySpeed;
function zoomBySpeed (config, step) {
  var current = step.speed;
  // Determine difference between current speed and 30mph (about average driving speed)
  var speedDiff = current - 30;
  // Calibrate to 70mph
  var zoomDiff = speedDiff / 70;
  // Determine new zoom level
  var response = config.zoom - zoomDiff;

  var minzoom = config.minzoom || (config.zoom-1);
  var maxzoom = config.maxzoom || (config.zoom+1);
  return Math.min(maxzoom, Math.max(minzoom, response));
}
