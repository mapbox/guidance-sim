var fs = require('fs');
var util = require('./util.js');

// Protocol for when running from `configure.sh`
if (!module.parent) {
  version(process.argv[2]);
}

/**
 * This function writes the directions API verison to a local file.
 * This funciton is used by `configure.sh` to inform which fields are required in the maneuvers array in the configuration
 * @name version
 * @param {string} filepath Filepath to saved Mapbox Directions API response.
 * @returns {file} version.txt File is written to /tmp/version.txt with version number.
 */
module.exports = version;
function version (filepath) {
  var route = JSON.parse(fs.readFileSync(filepath));
  var version = util.version(route);
  console.log(version);
  return version;
}
