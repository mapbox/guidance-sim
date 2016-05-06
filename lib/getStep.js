var turfAlong = require('turf-along');
var turfDistance = require('turf-distance');
var turfLinestring = require('turf-linestring');
var turfPoint = require('turf-point');

module.exports = getLocation;
function getLocation(geojson, time, version, output) {
  var coordinates = [];
  var times = [];
  times.push(0);
  var timeCounter = 0;

  if (version === 'v5') {
    for (var i = 0; i < geojson.routes[0].legs[0].steps.length; i++) {
      timeCounter = timeCounter + geojson.routes[0].legs[0].steps[i].duration * 1000;
      times.push(timeCounter);
      coordinates.push(geojson.routes[0].legs[0].steps[i].maneuver.location);
    }
  } else if (version === 'v4') {
    for (i = 0; i < geojson.routes[0].steps.length; i++) {
      timeCounter = timeCounter + geojson.routes[0].steps[i].duration * 1000;
      times.push(timeCounter);
      coordinates.push(geojson.routes[0].steps[i].maneuver.location);
    }
  }

  if (output === 'step') {
    for (i = 0; i < times.length; i++) {
      if (time >= times[i] && time < times[i+1]) {
        var step = i;
      }
    }
    return step;
  }

  if (output === 'coords') {
    for (i = 0; i < times.length; i++) {
      if (time >= times[i] && time < times[i+1]) {
        var segmentDist = turfDistance(turfPoint(coordinates[i]), turfPoint(coordinates[2]), 'miles');
        var percAlong = (time - times[i]) / (times[i+1] - times[i]);
        var distCovered = segmentDist * percAlong;
        var segment = turfLinestring([ coordinates[i], coordinates[i+1] ]);
        var coords = turfAlong(segment, distCovered, 'miles');
        return coords
      }
    }
  }
}