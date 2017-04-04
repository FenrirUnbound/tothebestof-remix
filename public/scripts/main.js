'use strict';

const app = angular.module('ttbo', [
  'ngSanitize'
]);

function getArtist($http, artist) {
  return $http({
    method: 'GET',
    url: `/api/artists/${artist}`
  }).then(response => Promise.resolve(response.data.data));
}

function getTopTracks($http, artist) {
  return $http({
    method: 'GET',
    url: `/api/artists/${artist}/tracks`
  }).then(response => Promise.resolve(response.data.data));
}

app.controller('AppController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
  $scope.searchText = '';
  $scope.artist = {
    name: '',
    bio: '',
    image: ''
  };
  $scope.topTracks = [];

  $scope.search = () => {
    const artistName = $scope.searchText;

    if (!artistName) { return; }

    return Promise.all([
      getArtist($http, artistName),
      getTopTracks($http, artistName)
    ]).then(([ artistInfo, topTracks ]) => {
      $scope.artist = artistInfo;

      const maxPopularity = topTracks[0].listeners;
      $scope.topTracks = topTracks.slice(0, 10).map((track) => {
        return {
          name: track.name,
          popularity: track.listeners / maxPopularity * 100
        };
      });

      $scope.$apply();
    });
  };
}]);
