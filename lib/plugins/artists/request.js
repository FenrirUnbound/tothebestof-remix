'use strict';

const requestLib = require('request');

module.exports = (options) => {
  const requestOptions = Object.assign({
    json: true
  }, options);

  return new Promise((resolve, reject) => {
    return requestLib(requestOptions, (err, data) => {
      if (err) { return reject(err); }

      return resolve(data);
    });
  });
};
