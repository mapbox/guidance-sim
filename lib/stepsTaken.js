/**
 * This function runs the Emitter.stepsTaken function from
 * guidance-replay (see https://github.com/mapbox/guidance-replay)
 * using the start time determined by the user in the configuration file.
 * @name stepsTaken
 * @param {Object} emitter An Emitter class. See https://github.com/mapbox/
 * guidance-replay#emitter.
 * @param {Number} scrub Start time in milliseconds.
 */
module.exports = stepsTaken;
function stepsTaken(emitter, scrub) {
  emitter.stepsTaken(scrub);
}