'use strict';

const client = require('./lastfm-client');

module.exports = (request, reply) => {
  const { q } = request.query;

  return client.searchArtist(decodeURIComponent(q))
    .then((response) => {
      const artists = response.map(searchInfo => searchInfo.name);

      return reply({
        data: artists
      }).code(200);
    });
}
