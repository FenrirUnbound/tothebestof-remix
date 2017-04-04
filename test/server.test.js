'use strict';

const expect = require('chai').expect;

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
});
