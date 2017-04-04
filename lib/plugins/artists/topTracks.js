'use strict';

const client = require('./lastfm-client');

function formatTracks(tracks) {
  const result = tracks.track.map((track) => {
    return {
      listeners: parseInt(track.listeners, 10),
      name: track.name,
      playCount: parseInt(track.playcount, 10),
      url: track.url
    };
  });

  return Promise.resolve(result);
}

module.exports = (request, reply) => {
  const { artistName } = request.params;

  return client.getTopTracks(artistName)
  .then(formatTracks)
  .then(data => reply({ data }));
}
