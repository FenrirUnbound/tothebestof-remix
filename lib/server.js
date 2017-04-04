'use strict';

const hapi = require('hapi');
const registerPlugins = require('./plugins');

module.exports = () => {
  const server = new hapi.Server();

  server.connection({
    port: process.env.PORT || 5000
  });

  return registerPlugins(server).then(() => {
    return server.start();
  }).then(() => server);
};
