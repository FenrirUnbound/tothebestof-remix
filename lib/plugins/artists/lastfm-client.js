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
 * [getArtist description]
 * @param  {[type]} artist [description]
 * @return {[type]}        [description]
 */
function getArtist(artist) {
  const accessKey = process.env.LASTFM_KEY;

  return request({
    method: 'GET',
    uri: urlBuilder({
      method: 'artist.getinfo',
      artist,
      format: 'json',
      api_key: accessKey
    })
  }).then(response => response.body.artist);
}

/**
 * [getTopTracks description]
 * @param  {String} artist  Artist name
 * @return {Promise}
 */
function getTopTracks(artist) {
  const accessKey = process.env.LASTFM_KEY;

  return request({
    method: 'GET',
    uri: urlBuilder({
      method: 'artist.gettoptracks',
      artist,
      format: 'json',
      api_key: accessKey
    })
  }).then(response => response.body.toptracks);
}

module.exports = {
  getArtist,
  getTopTracks
};
