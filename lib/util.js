module.exports = util = {};

/**
 * This function determines the directions API verison.
 * @name version
 * @param {Object} route Mapbox Directions API response. May be `v4` or `v5`.
 * @returns {string} v `v4` or `v5` depending on presence of `code` property.
 */
module.exports.version = version;
function version (route) {
  var v;
  if (route.code) {
    v = 'v5';
  } else {
    v = 'v4';
  }
  return v;
}

/**
 * This function determines the minimum value in an array.
 * @name min
 * @param {Array<number>} array Any numbers.
 * @returns {number} array[0] Smallest value in sorted array.
 */
module.exports.min = min;
function min (array) {
  array.sort();
  return array[0];
}

/**
 * This function converts a timestamp containing hours (h), minutes (m), and/or seconds (s)
 * into a total value in milliseconds (ms)
 * @name timestamp
 * @param {object} config Configuration parameters.
 * @param {string} config.time Timestamp with format #h (hours),
 * #m (minutes), and/or #s (seconds) where # is any <number>.
 * @returns {number} scrub Time in milliseconds.
 */
module.exports.timestamp = timestamp;
function timestamp (config) {
  var scrub = 0;
  var options = [
    /\d*h/,
    /\d*m/,
    /\d*s/
  ];

  for (var i = 0; i < options.length; i++) {
    var value = config.time.match(options[i]);
    if (value !== null) {
      var unit = value[0].slice(-1);
      value = value[0].substring(0, value[0].length - 1);
      if (unit === 'h') { scrub += value * 60 * 60 * 1000; }
      if (unit === 'm') { scrub += value * 60 * 1000; }
      if (unit === 's') { scrub += value * 1000; }
    }
  }
  return scrub;
}

/**
 * This function provides an interval speed given a playback speed and interval frequency.
 * @name speed
 * @param {Object} config Configuration parameters.
 * @param {string} config.speed Speed with format #x where # is any <number>.
 * @param {number} frequency Event emitter frequency.
 * @returns {number} Replay speed required to obtain desired playback speed.
 */
module.exports.speed = speed;
function speed (config, frequency) {
  var constant = Number(config.speed.slice(0, config.speed.indexOf('x')));
  return frequency / constant;
}

/**
 * This function formats integers nicely.
 * @name isInteger
 * @param {number} x Any number.
 * @returns {number} If input is an integer, an integer is returned.
 * If input is not an integer, a value with 1 decimal place is returned.
 */
module.exports.isInteger = isInteger;
function isInteger (x) {
  if (x.toFixed(1) % 1 === 0) {
    return Number(x.toFixed(0));
  } else {
    return Number(x.toFixed(1));
  }
}

/**
 * This function converts between miles and kilometers.
 * @name distanceConvert
 * @param {number} value Any number
 * @param {number} unit The unit you wish to convert your distance or speed to.
 * `mi` will convert a value in km to a distance in mi.
 * `km` will convert a value in mi to a distance in km.
 * @returns {number} Value with specified `unit`.
 */
module.exports.distanceConvert = distanceConvert;
function distanceConvert (value, unit) {
  if (unit === 'mi') {
    return Number(value * 0.621371);
  } else if (unit === 'km') {
    return Number(value * 1.60934);
  }
}

/**
 * This function takes the first character of a string, and converts it
 * from uppercase to lowercase.
 * @name firstToLowerCase
 * @param {string} string Any string
 * @returns {string} modified A string where the first character is lowercase
 */
module.exports.firstToLowerCase = firstToLowerCase;
function firstToLowerCase(string) {
  var modified = string.substr(0, 1).toLowerCase() + string.substr(1);
  return modified;
}
