'use strict';

const PLUGINS = [
  require('./status'),
  require('./logger')
];

module.exports = (server) => {
  const registrations = PLUGINS.map((plugin) => {
    return server.register({
      register: plugin
    }, {
      routes: {
        prefix: `/api/${plugin.register.attributes.name}`
      }
    });
  });

  return Promise.all(registrations);
};
