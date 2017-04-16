'use strict';

const client = require('./clients/spotifyClient');

const BASE_URL = 'https://api.spotify.com';

function searchHashForToken(hash) {
  const parts = hash.split('&');

  const tokenPart = parts.find((param) => {
    if (param.indexOf('access') === 0) {
      return param;
    }
  });

  return tokenPart.split('=')[1];
}

function promiseToWait(seconds) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), seconds * 1000)
  );
}

function addSongsToPlaylist($http, options) {
  const { accessToken, playlistId, trackUris, userId} = options;

  $http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  return $http({
    method: 'POST',
    url: `${BASE_URL}/v1/users/${userId}/playlists/${playlistId}/tracks`,
    data: JSON.stringify({
      uris: trackUris
    })
  }).then(response => response.data);
}

function SpotifyController ($scope, $location, $http, $window) {
  $scope.updates = [];
  $scope.progress = 0.0;
  const progress = {
    current: 0,
    totalItems: 1 + 1 + 1 + 1
  };

  const accessToken = searchHashForToken($location.hash());
  const artistName = localStorage.getItem('artistName');
  const tracks = localStorage.getItem('tracks').split(',');

  const fetchUserInfo = client.getUser($http, accessToken)
    .then((userInfo) => {
      progress.current += 1;
      $scope.progress = progress.current / progress.totalItems * 100;
      $scope.updates.push('Retrieved user information');

      return userInfo;
    });
  const fetchSongs = tracks.reduce((chain, songName, index) => {
    return chain.then((trackIds) => {
      const results = trackIds.slice();

      return client.searchTrack($http, {
        accessToken,
        artistName,
        songName
      }).then((trackData) => {
        const items = trackData.tracks.items;

        if (items.length > 0) {
          results.push(items[0]);

          progress.current += 0.1;
          $scope.progress = (progress.current / progress.totalItems * 100).toFixed(2);
          $scope.updates.push(`Found ${index+1} tracks`);
        }

        return Promise.resolve(results);
      });
    })
  }, Promise.resolve([]));

  const postPlaylist = fetchUserInfo.then((userInfo) => {
    return Promise.resolve(); //TODO

    return client.createPrivatePlaylist($http, {
      accessToken,
      artistName: decodeURIComponent(artistName),
      playlistName: `ttbo-${decodeURIComponent(artistName)}`,
      userId: userInfo.id
    }).then((data) => {
      progress.current += 1;
      $scope.progress = (progress.current / progress.totalItems * 100).toFixed(2);
      $scope.updates.push('Created playlist');

      return data;
    });
  });

  return Promise.all([
    fetchUserInfo,
    postPlaylist,
    fetchSongs
  ]).then(([ userInfo, playlist, trackData ]) => {
    const trackUris = trackData.map(track => track.uri);

    return Promise.resolve([1, 2, 3]); // TODO

    const playlistUpdate = client.addToPlaylist($http, {
      accessToken,
      playlistId: playlist.id,
      trackUris,
      userId: userInfo.id
    });

    return Promise.all([
      userInfo,
      playlist,
      playlistUpdate
    ]);
  }).then(([ userInfo, playlist, playlistUpdate ]) => {
    progress.current = progress.totalItems;  //cheat
    $scope.progress = 100;
    $scope.updates.push('Complete!');

    console.log(playlistUpdate);
    // $window.location.href = `https://open.spotify.com/user/${userInfo.id}/playlist/${playlist.id}`;
  });
}

module.exports = ['$scope', '$location', '$http', '$window', SpotifyController];
