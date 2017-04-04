'use strict';

const artistInfoHandler = require('./artistInfo');
const topTracksHandler = require('./topTracks');

const artistsPlugin = {
  register: (server, options, next) => {
    server.route({
      method: 'GET',
      path: '/{artistName}',
      handler: artistInfoHandler
    });

    server.route({
      method: 'GET',
      path: '/{artistName}/tracks',
      handler: topTracksHandler
    });

    next();
  }
};

artistsPlugin.register.attributes = {
  name: 'artists',
  version: '1.0.0'
};

module.exports = artistsPlugin;
