var mapboxgl = require('mapbox-gl');
var queue = require('queue-async');
var request = require('request');
var stylePrep = require('guidance-geojson').stylePrep;
var styleRoute = require('guidance-geojson').styleRoute;

var config = require('./configuration.json');
var run = require('../index.js');
var util = require('../lib/util.js');

// Ensure that access token is set locally
if (!process.env.MapboxAccessToken) {
  throw new Error('An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens');
} else {
  mapboxgl.accessToken = process.env.MapboxAccessToken;
}

// Initiate the map using the guidance-geojson stylePrep function
var style = JSON.parse(JSON.stringify(require('./style.json')));
var map = new mapboxgl.Map({
  hash: false,
  container: 'map',
  zoom: config.zoom,
  style: stylePrep(style, 'route'),
  interactive: false
}).setPitch(config.pitch);

// Pass default values to HTML file for display & run the simulation when the map style is loaded
document.getElementById('step-pitch').innerHTML = 'pitch: ' + util.isInteger(config.pitch) + '°';
document.getElementById('step-zoom').innerHTML = 'zoom: ' + util.isInteger(config.zoom);
if (config.spacing === 'acceldecel') { document.getElementById('step-speed').innerHTML = 'speed: ' + 0 + ' mph'; }

map.on('style.load', function () {
  var res = run(map, config);
  // Add the stylized route to the map
  styleRoute(mapboxgl, map, config.route);
  // Display updated simulation parameters
  res.on('update', function(data) {
    document.getElementById('step-pitch').innerHTML = 'pitch: ' + util.isInteger(data.pitch) + '°';
    document.getElementById('step-zoom').innerHTML = 'zoom: ' + util.isInteger(data.zoom);
    if (data.speed) { document.getElementById('step-speed').innerHTML = 'speed: ' + util.isInteger(data.speed) + ' mph'; }
  });
});
