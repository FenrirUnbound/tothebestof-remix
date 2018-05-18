'use strict';

const env = require('node-env-file');
const expect = require('chai').expect;
const path = require('path');

env(path.resolve(__dirname, '../.env'), { raise: false });

describe('server test', () => {
  let server;

  before(() => {
    const main = require('../lib/server');

    return main().then((testServer) => {
      server = testServer;
    });
  });

  after(() => {
    server = null;
  });

  it('serves the status endpoint', () => {
    return server.inject({
      method: 'GET',
      url: '/api/status'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload).to.deep.equal({
        status: 'OK'
      });
    });
  });

  it('returns the top tracks of an artist', () => {
    const artistName = 'Rick Astley';

    return server.inject({
      method: 'GET',
      url: `/api/artists/${encodeURIComponent(artistName)}/tracks`
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload.data).to.be.an('array')
        .of.length(50);

      const targetTrack = payload.data[0];

      expect(targetTrack.name).to.equal('Never Gonna Give You Up');
      expect(targetTrack.playCount).to.be.above(2165960);
      expect(targetTrack.listeners).to.be.above(435225);
    });
  });

  it('returns the top tracks of a non-English artist', () => {
    const artistName = '五月天';

    return server.inject({
      method: 'GET',
      url: `/api/artists/${encodeURIComponent(artistName)}/tracks`
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload.data).to.be.an('array')
        .of.length(50);
    });
  });

  it('returns the artist info', () => {
    return server.inject({
      method: 'GET',
      url: '/api/artists/rick%20astley'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload.data).to.be.an('object');

      expect(payload.data.name).to.equal('Rick Astley');
    });
  });

  it('searches for an artist', () => {
    return server.inject({
      method: 'GET',
      url: '/api/artists?q=leessang'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload).to.have.property('data')
        .that.is.an('array');
      expect(payload.data.length).to.be.at.least(2);
    });
  });

  it('searches for a URI encoded artist', () => {
    const artistName = '五月天';

    return server.inject({
      method: 'GET',
      url: `/api/artists?q=${encodeURIComponent(artistName)}`
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload).to.have.property('data')
        .that.is.an('array');
      expect(payload.data[0]).to.equal(artistName);
    });
  });

  it('returns the track info', () => {
    return server.inject({
      method: 'GET',
      url: '/api/artists/rick%20astley/videos/angels%20on%20my%20side'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload.data).to.be.an('object');
      expect(payload.data).to.have.property('id');

      expect(payload.data.id).to.be.an('object')
        .that.has.property('videoId').to.equal('cc91EfoBh8A');
    });
  });
});
