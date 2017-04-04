'use strict';

const good = require('good');

const loggerPlugin = {
  register: good.register
};

loggerPlugin.register.attributes = good.register.attributes;

module.exports = loggerPlugin;
