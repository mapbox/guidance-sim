var Locator = require('guidance-replay').Locator;
var mapboxgl = require('mapbox-gl');
var point = require('turf-point');
var progressBar = require('progressbar.js');
var stylePrep = require('guidance-geojson').stylePrep;
var styleRoute = require('guidance-geojson').styleRoute;

var config = require('./configuration.json');
var run = require('../index.js').simulate;
var util = require('../lib/util.js');
var version = util.version(config.route);

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

if (version === 'v5') {
  var maneuversDiv = document.getElementById('maneuvers');
  maneuvers.style.visibility = 'visible'; // make maneuvers div visible
  // Initialize progress bar for Directions v5 responses
  var bar = new progressBar.Circle(circle, {
    strokeWidth: 7,
    easing: 'easeInOut',
    duration: 1000,
    color: '#fff',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'}
  });
};

updateParams(config); // pass default values to HTML file for display & run the simulation when the map style is loaded

map.on('style.load', function () {
  var res = run(map, config); // run the simulation
  styleRoute(mapboxgl, map, config.route); // add the stylized route to the map

  res.on('update', function(data) {
    updateParams(data); // display updated simulation parameters
    var locator = new Locator(config.route);
    var userStep = locator.step(data.time);
    // add navigation for Mapbox Directions v5 responses
    if (version === 'v5') {
      var navigation = require('navigation.js')({
        units: 'miles',
        maxReRouteDistance: 0.03,
        maxSnapToLocation: 0.01
      });

      var userLocation = point(data.coords); // get the current simulation location
      var route = config.route.routes[0].legs[0];
      if (userStep < route.steps.length) {
        var userNextStep = navigation.getCurrentStep(userLocation, route, userStep); // determine the next step
        if (userNextStep.step > userStep) { userStep++; } // if the step has incremented up in the navigation.js response, increment in simulation as well
        animateBar(bar, userNextStep);
        if (userNextStep.step < route.steps.length - 1) {
          document.getElementById('step').innerHTML = route.steps[userNextStep.step + 1].maneuver.instruction;
        } else {
          document.getElementById('step').innerHTML = 'You have reached your destination';
        }
      }
    }
  });
});

function updateParams(source) {
  document.getElementById('step-pitch').innerHTML = 'pitch: ' + util.isInteger(source.pitch) + '°';
  document.getElementById('step-zoom').innerHTML = 'zoom: ' + util.isInteger(source.zoom);
  if (source.maneuvers) { // indicates map initialization since the config is passed instead of emitter data
    if (source.spacing && source.spacing === 'acceldecel') {
      document.getElementById('step-speed').innerHTML = 'speed: ' + 0 + ' mph';
    }
  } else {
    if (!source.maneuvers && source.speed) {
      document.getElementById('step-speed').innerHTML = 'speed: ' + util.isInteger(source.speed) + ' mph';
    }
  }
}

function animateBar(bar, userNextStep) {
  var percentComplete = 1 - (userNextStep.distance / userNextStep.stepDistance);
  bar.set(percentComplete);  // Number from 0.0 to 1.0
}
