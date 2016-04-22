/**
 * This function retrieves the location of all maneuvers specified in the route.
 * The maneuvers in this object should align with the maneuvers specified in the
 * config.maneuvers array.
 * @name getManeuvers
 * @param {Object} config Configuration parameters.
 * See `run` function for more information.
 * @param {string} version Directions API version.
 * @returns {Object} All manuevers along route by coordinate position where.
 *      key {string} Coordinate position.
 *    value {string} Maneuver description.
 */
module.exports = maneuvers;
function maneuvers (config, version) {
  var maneuvers = {};
  var location;
  var type;
  if (version === 'v5') {
    for (var i = 0; i < config.route.routes[0].legs[0].steps.length; i++) {
      if (config.route.routes[0].legs[0].steps[i].maneuver) {
        location = config.route.routes[0].legs[0].steps[i].maneuver.location;
        type = config.route.routes[0].legs[0].steps[i].maneuver.type;
        var modifier = config.route.routes[0].legs[0].steps[i].maneuver.modifier;
        maneuvers[location] = [type, modifier];
      }
    }
  } else {
    for (var j = 0; j < config.route.routes[0].steps.length; j++) {
      location = config.route.routes[0].steps[j].maneuver.location.coordinates;
      type = config.route.routes[0].steps[j].maneuver.type;
      maneuvers[location] = [type];
    }
  }
  return maneuvers;
}