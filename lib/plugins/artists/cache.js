'use strict';

const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASS
});

const DEFAULT_TTL = 60 * 60 * 24 * 7; // 1 week in seconds

client.on('error', (err) => {
  console.error(`Error: ${err}`);
});

/**
 * [generateKey description]
 * @param  {Object} config
 * @return {[type]}        [description]
 */
function generateKey({ artist, track }) {
  const cacheKey = (track) ? `${artist}:${track}` : artist;

  return encodeURI(cacheKey);
}

/**
 * [set description]
 * @param {Object} key
 * @param {String} key.artist   Name of the artist
 * @param {String} key.track    track title
 * @param {String} value        videoId
 */
function save(keys, value) {
  const cacheKey = generateKey(keys);

  if (!value) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    return client.set(cacheKey, value, 'ex', DEFAULT_TTL, (err) => {
      if (err) { return reject(err); }

      return resolve();
    });
  });
}

/**
 * [fetch description]
 * @param  {Object} key
 * @param  {String} key.artist   Name of artist
 * @param  {String} key.track    track title
 * @return {Promise}             Resolves to the video ID
 */
function fetch(keys) {
  const cacheKey = generateKey(keys);

  return new Promise((resolve, reject) => {
    return client.get(cacheKey, (err, data) => {
      if (err) { return reject(err); }

      return resolve(data);
    });
  });
}

module.exports = { fetch, save };
