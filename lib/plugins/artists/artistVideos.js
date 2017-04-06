'use strict';

const request = require('./request');
const url = require('url');

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

  return request({
    method: 'GET',
    uri: buildUri(artistName, trackTitle)
  }).then((response) => {
    const payload = response.body;

    // Greedy. Take the first one and hope it's right
    // TODO: maybe make this smarter
    const trackInfo = payload.items[0];

    reply({
      data: trackInfo
    });
  });
}
