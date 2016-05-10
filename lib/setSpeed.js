var setMap = require('./simulate').setMap;

/**
 * This function clears the current interval and reinitializes using a new speed value.
 * @name setSpeed
 * @param {Object} response An EventEmitter object.
 * @param {Number} interval An interval ID.
 * @param {Number} speed The duration in milliseconds over which to ease the map to the new location.
 * @param {Object} options Map options from initialization.
 * @returns {Number} interval An updated interval ID based on the new `speed` value. 
 */
module.exports = setSpeed;
function setSpeed(response, interval, speed, options) {
  response.emit(clearInterval(interval));
  interval = setInterval(function () {
    setMap(interval, speed, options);
  }, speed);
  return interval;
}