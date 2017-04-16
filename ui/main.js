'use strict';

const angular = require('angular');
const ngSanitize = require('angular-sanitize');
const ngRoute = require('angular-route');

const artistTracksController = require('./artistTracks');
const searchController = require('./search');
const spotifyController = require('./spotify');

const MAX_TRACKS = 10;

const app = angular.module('ttbo', [
  'ngRoute',
  'ngSanitize'
]);

app.config([
  '$locationProvider',
  '$routeProvider',
  function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        controller: 'AppController'
      })
      .when('/artists/:artistName', {
        controller: 'ArtistController',
        templateUrl: 'artist.html'
      })
      .when('/spotify', {
        controller: 'SpotifyController',
        templateUrl: 'spotify.html'
      })
      .otherwise('/spotify');
      // .otherwise('/')
  }
]);

app.controller('SearchController', searchController);
app.controller('ArtistController', artistTracksController);
app.controller('SpotifyController', spotifyController);
