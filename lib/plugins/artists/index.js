'use strict';

const artistInfoHandler = require('./artistInfo');
const artistSearchHandler = require('./artistSearch');
const artistVideosHandler = require('./artistVideos');
const topTracksHandler = require('./topTracks');

const artistsPlugin = {
  register: (server, options, next) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: artistSearchHandler
    });

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

    // TODO: allow endpoint to accept multiple tracks
    // TODO: cache this endoint
    server.route({
      method: 'GET',
      path: '/{artistName}/videos/{trackTitle}',
      handler: artistVideosHandler
    });

    next();
  }
};

artistsPlugin.register.attributes = {
  name: 'artists',
  version: '1.0.0'
};

module.exports = artistsPlugin;
