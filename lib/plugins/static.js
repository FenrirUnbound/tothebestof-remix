'use strict';

const path = require('path');

const staticAssetPlugin = {
  register: (server, options, next) => {
    server.route({
      method: 'GET',
      path: '/scripts/{param*}',
      handler: {
        directory: {
          index: true,
          path: path.resolve(__dirname, '../../public/scripts')
        }
      }
    });
    server.route({
      method: 'GET',
      path: '/styles/{param*}',
      handler: {
        directory: {
          index: true,
          path: path.resolve(__dirname, '../../public/styles')
        }
      }
    });
    server.route({
      method: 'GET',
      path: '/images/{param*}',
      handler: {
        directory: {
          index: true,
          path: path.resolve(__dirname, '../../public/images')
        }
      }
    });
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        file: path.resolve(__dirname, '../../public/index.html')
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
