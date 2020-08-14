const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Application launch', function () {
  this.timeout(12000);
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
  it('has the correct title', async () => {
    const title = await app.client.getTitle();
    return assert.equal(title, 'AddonClient');
  });
});
