'use strict';

const MAX_TRACKS = 10;

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
  }).then(response => Promise.resolve(response.data.data.slice(0, MAX_TRACKS)));
}

function createVid($scope, videoIds) {
  // sigh. this is expensive AF
  $('#videoPort').replaceWith('<div id="videoPort"></div>');

  const first = videoIds.shift();
  const player = new YT.Player('videoPort', {
    height: '349',
    width: '560',
    playerVars: {
      playlist: videoIds.join(',')
    },
    videoId: first
  });
}

function getVideos($http, artist, tracks) {
  const request = ($http, artist, track) => {
    return $http({
      method: 'GET',
      url: encodeURI(`/api/artists/${artist}/videos/${track}`)
    });
  };

  const videoRequests = tracks.map((track) => request($http, artist, track.name));

  return Promise.all(videoRequests).then(results =>
    results.map((video) => video.data.data.id.videoId)
  );
}

app.controller('AppController', ['$scope', '$http', function ($scope, $http) {
  $scope.searchText = '';
  $scope.artist = {
    name: '',
    bio: '',
    image: ''
  };
  $scope.topTracks = [];
  $scope.video = {
    link: ''
  };

  $scope.search = () => {
    const artistName = $scope.searchText;

    if (!artistName) { return; }

    const fetchArtistInfo = getArtist($http, artistName);
    const fetchTopTracks = getTopTracks($http, artistName);

    const fetchVideoIds = fetchTopTracks
      .then(topTracks => getVideos($http, artistName, topTracks));

    return Promise.all([
      fetchArtistInfo,
      fetchTopTracks,
      fetchVideoIds,
    ]).then(([ artistInfo, topTracks, videoIds ]) => {
      $scope.artist = artistInfo;

      const maxPopularity = topTracks[0].listeners;
      $scope.topTracks = topTracks.map((track, index) => {
        return {
          name: track.name,
          popularity: track.listeners / maxPopularity * 100,
          videoId: videoIds[index]
        };
      });

      $scope.$apply();

      return createVid($scope, videoIds);
    });
  };
}]);
