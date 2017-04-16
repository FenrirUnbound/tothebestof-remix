'use strict';

const BASE_URL = 'https://api.spotify.com';

/**
 * [addToPlaylist description]
 * @param {[type]} $http   [description]
 * @param {Object}   options [description]
 * @param {String}   options.accessToken [description]
 * @param {String}   options.playlistId [description]
 * @param {String[]} options.trackUris [description]
 * @param {String}   options.userId [description]
 */
function addToPlaylist($http, options) {
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

/**
 * [createPlaylist description]
 * @param  {[type]} $http   [description]
 * @param  {Object} options [description]
 * @param  {String} options.accessToken [description]
 * @param  {String} options.artistName [description]
 * @param  {String} options.playlistName [description]
 * @param  {String} options.userId [description]
 * @return {[type]}         [description]
 */
function createPrivatePlaylist($http, options) {
  const { accessToken, artistName, playlistName, userId } = options;

  $http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  return $http({
    method: 'POST',
    url: `${BASE_URL}/v1/users/${userId}/playlists`,
    data: JSON.stringify({
      name: playlistName,
      public: false,
      collaborative: false,
      description: `To the best music of ${artistName}`
    })
  }).then(response => response.data);
}

function getUser($http, accessToken) {
  $http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return $http({
    method: 'GET',
    url: `${BASE_URL}/v1/me`
  }).then(response => response.data);
}

/**
 * [searchSong description]
 * @param  {[type]} $http   [description]
 * @param  {Object} options [description]
 * @param  {String} options.accessToken [description]
 * @param  {String} options.artistName [description]
 * @param  {String} options.songName [description]
 * @return {Promise}         [description]
 */
function searchTrack($http, options) {
  const { accessToken, artistName, songName } = options;

  $http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return $http({
    method: 'GET',
    url: `${BASE_URL}/v1/search?q=${songName}+artist:${artistName}&type=track`
  }).then(response => response.data);
}

module.exports = { addToPlaylist, createPrivatePlaylist, getUser, searchTrack };
