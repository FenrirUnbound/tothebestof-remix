'use strict';

const statusPlugin = {
  register: (server, options, next) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        return reply({
          status: 'OK'
        });
      }
    });

    next();
  }
};

statusPlugin.register.attributes = {
  name: 'status',
  version: '1.0.0'
};

module.exports = statusPlugin;
