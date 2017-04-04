'use strict';

const PLUGINS = [
  require('inert'),
  require('./status'),
  require('./logger')
];
const LOGGER_OPTIONS = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: '*',
            response: '*'
          }
        ]
      },
      {
        module: 'good-console'
      },
      'stdout'
    ]
  }
};

const pluginOptions = {
  good: LOGGER_OPTIONS
};

module.exports = (server) => {
  const registrations = PLUGINS.map((plugin) => {
    const name = plugin.register.attributes.name;
    const options = pluginOptions[name] || {};

    return server.register({
      register: plugin,
      options
    }, {
      routes: {
        prefix: `/api/${name}`
      }
    });
  });

  // static needs to be at the root
  registrations.push(server.register({
    register: require('./static')
  }));

  return Promise.all(registrations);
};
