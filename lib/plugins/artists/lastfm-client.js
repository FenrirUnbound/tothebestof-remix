'use strict';

const request = require('./request');
const url = require('url');

/**
 * Builds a URL for making a request to LastFM
 * @param  {Object} query  Hash of query parameters
 * @return {String}        LastFM url
 */
function urlBuilder(query) {
  return url.format({
    protocol: 'http',
    host: 'ws.audioscrobbler.com',
    pathname: '2.0',
    query
  });
}

/**
 * send a GET request to the LastFM API
 * @param  {Object} options
 * @param  {String} options.method  LastFM API method
 * @param  {String} options.artist  name of the artist
 * @return {Promise}                Promise that resolves to the HTTP response
 */
function getRequest(options) {
  const builderOptions = Object.assign({
    api_key: process.env.LASTFM_KEY,
    format: 'json'
  }, options);

  return request({
    method: 'GET',
    uri: urlBuilder(builderOptions)
  });
}

/**
 * [getArtist description]
 * @param  {[type]} artist [description]
 * @return {[type]}        [description]
 */
function getArtist(artist) {
  return getRequest({
    method: 'artist.getinfo',
    artist
  })
  .then((response) => {
    const errCheck = response.body.error;

    if (errCheck) {
      const err = new Error(response.body.message);
      err.code = errCheck;

      return Promise.reject(err);
    }

    return response.body.artist;
  });
}

/**
 * [getTopTracks description]
 * @param  {String} artist  Artist name
 * @return {Promise}
 */
function getTopTracks(artist) {
  return getRequest({
    method: 'artist.gettoptracks',
    artist
  }).then(response => response.body.toptracks);
}

/**
 * search for artists
 * @method searchArtist
 * @param  {String}  artist  Name of the artist to search for
 * @return {Promise}         Promise that resolves to the search results
 */
function searchArtist(artist) {
  return getRequest({
    method: 'artist.search',
    artist
  }).then(response => response.body.results.artistmatches.artist);
}

module.exports = {
  getArtist,
  getTopTracks,
  searchArtist
};
