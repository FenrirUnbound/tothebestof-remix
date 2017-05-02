'use strict';

const cache = require('./cache');
const request = require('./request');
const url = require('url');

const THIRTY_SECONDS = 30 * 1000;

function buildUri(artistName, trackTitle) {
  const artist = artistName.replace(/ /g, '+');
  const track = trackTitle.replace(/ /g, '+');
  const apiKey = process.env.YTUBE_KEY;

  return url.format({
    protocol: 'https',
    host: 'www.googleapis.com',
    pathname: 'youtube/v3/search',
    query: {
      part: 'id,snippet',
      key: apiKey,
      maxResults: 5,
      type: 'video',
      q: `${artist}+${track}`
    }
  });
}

module.exports = (req, reply) => {
  const { artistName, trackTitle } = req.params;

  return cache.fetch({
    artist: artistName,
    track: trackTitle
  }).then((cachedValue) => {
    if (cachedValue && cachedValue !== 'undefined') {
      return Promise.resolve(JSON.parse(cachedValue));
    }

    return request({
      method: 'GET',
      timeout: THIRTY_SECONDS,
      uri: buildUri(artistName, trackTitle)
    }).then((response) => {
      const payload = response.body;

      // Greedy. Take the first one and hope it's right
      // TODO: maybe make this smarter
      const trackInfo = payload.items[0];

      if (!trackInfo) {
        console.log(`Video search yield empty for "${artistName} -- ${trackTitle}"`);

        return Promise.resolve(null);
      }

      return cache.save({
        artist: artistName,
        track: trackTitle
      }, JSON.stringify(trackInfo))
      .then(() => Promise.resolve(trackInfo));
    });
  }).then(trackInfo => reply({
    data: trackInfo
  }));
}
