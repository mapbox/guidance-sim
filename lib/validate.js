var fs = require('fs');
var util = require('./util.js');

// Protocol for when running from `validate.sh`
if (!module.parent) {
  var config = JSON.parse(fs.readFileSync(process.argv[2]));
  console.log(validate(config));
}

/**
 * This function validates configuration parameters
 * @name validate
 * @param {Object} config Configuration parameters.
 * @returns {Object} If the job is successful, it will return the configuration object.
 * Otherwise, an error will be thrown.
 */
module.exports.validate = validate;
function validate (config) {
  // StyleID is required, must be a string, and must start with 'mapbox://styles/'
  if (typeof config.style !== 'string' || !config.style) throw new Error('{style} is required and must be a string');
  if (config.style.match(/mapbox:\/\/styles\/.*\/.*/) === null || config.style !== config.style.match(/mapbox:\/\/styles\/.*\/.*/)[0]) throw new Error('{style} must start with mapbox://styles/');
  
  // Route is required, must be an object, and must be a directions API response
  if (typeof config.route !== 'object' || !config.route) throw new Error('{route} is required and must be an object');
  if (!config.route.waypoints || !config.route.routes) throw new Error('{route} must be a directions API response');
  
  var version = util.version(config.route);
  var v4options = [
    '',
    'constant'
  ];
  var v5options = [
    '',
    'constant',
    'acceldecel'
  ];

  // If spacing is specified it must be a string
  if (config.spacing !== undefined && typeof config.spacing !== 'string') throw new Error('{spacing}, if specified, must be a string');
  // Spacing may be blank or 'constant' for v4 directions API responses
  if (config.spacing && version === 'v4' && v4options.indexOf(config.spacing) === -1) throw new Error('{spacing}, if specified, must either be null or constant for v4 directions responses');
  // Spacing may be blank, 'constant', or 'acceldecel' for v5 directions API responses
  if (config.spacing && version === 'v5' && v5options.indexOf(config.spacing) === -1) throw new Error('{spacing}, if specified, must either be null, constant, or acceldecel for v5 directions responses');

  // Zoom is required, must be a number, and must be between 0 and 20
  if (typeof config.zoom !== 'number') throw new Error('{zoom} is required and must be a number');
  if (config.zoom < 0 || config.zoom > 20) throw new Error('{zoom} must be between 0 and 20');

  // Pitch is required, must be a number, and must be between 0 and 60
  if (typeof config.pitch !== 'number') throw new Error('{pitch} is required and must be a number');
  if (config.pitch < 0 || config.pitch > 60) throw new Error('{pitch} must be between 0 and 60');
  
  var options = [
    /\d*h/,
    /\d*m/,
    /\d*s/
  ];

  // Time is required, must be a string, and must be comprised of hours (h), minutes (m), and/or seconds (s)
  // Examples: 00m00s, 1h, 00h30m15s
  if (typeof config.time !== 'string' || !config.time) throw new Error('{time} is required and must be a string');
  var counter = 0;
  for (var i = 0; i < options.length; i++) {
    if (config.time.match(options[i]) !== null) { counter++; }
  }
  if (counter === 0) throw new Error('{time} must have a #a format where a can be h, m, or s');

  // Speed is required, must be a stirng, and must be follow a #x format
  // Examples: 1.5x, 0.5x
  if (typeof config.speed !== 'string' || !config.speed) throw new Error('{speed} is required and must be a string');
  if (config.speed.match(/\d*x/) === null) throw new Error('{speed} must have a #x format');

  // Maneuvers is required and must be an array
  // If route is v4 directions response, each maneuver element must have: type, buffer, zoom, pitch
  // If route is v5 directions response, each maneuver element must have: type, modifier, buffer, zoom, pitch
  if (Array.isArray(config.maneuvers) !== true || !config.maneuvers) throw new Error('{maneuvers} is required and must be an array');
  for (var j = 0; j < config.maneuvers.length; j++) {
    if (Array.isArray(config.maneuvers[j].type) !== true) throw new Error('{maneuver type} is required and must be an array');
    if (version === 'v5' && Array.isArray(config.maneuvers[j].modifier) !== true) throw new Error('{maneuver modifier} is required and must be an array for v5 directions responses');
    if (version === 'v4' && config.maneuvers[j].modifier !== undefined) throw new Error('{maneuver modifier} is not a property in v4 directions responses');
    if (typeof config.maneuvers[j].buffer !== 'number') throw new Error('{maneuver buffer} is required and must be a number');
    if (config.maneuvers[j].buffer < 0) throw new Error('{maneuver buffer} must be greater than or equal to 0');
    if (typeof config.maneuvers[j].zoom !== 'number') throw new Error('{maneuver zoom} is required and must be a number');
    if (config.maneuvers[j].zoom < 0 || config.maneuvers[j].zoom > 20) throw new Error('{maneuver zoom} must be between 0 and 20');
    if (typeof config.maneuvers[j].pitch !== 'number') throw new Error('{maneuver pitch} is required and must be a number');
    if (config.maneuvers[j].pitch < 0 || config.maneuvers[j].pitch > 60) throw new Error('{maneuver pitch} must be between 0 and 60');
  }

  return (config);
}
