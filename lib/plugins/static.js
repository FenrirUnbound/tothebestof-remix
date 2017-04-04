'use strict';

const path = require('path');

const staticAssetPlugin = {
  register: (server, options, next) => {
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          index: true,
          path: path.resolve(__dirname, '../../public')
        }
      }
    });

    next();
  }
};

staticAssetPlugin.register.attributes = {
  name: 'static',
  version: '1.0.0'
};

module.exports = staticAssetPlugin;
