const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Application launch', function () {
  this.timeout(10000);
  beforeEach(function () {
    app = new Application({
      path: electronPath,

      args: [path.join(__dirname, '../main/')],
      env: {
        NODE_ENV: 'testing',
      },
    });
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', function () {
    return app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });
});
