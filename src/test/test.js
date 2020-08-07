const AddonManager = require('../renderer/services/addon_manager.js');
const assert = require('chai').assert;

const addonManager = new AddonManager(__dirname);

describe('Get list of addons', () => {
  it('Returns array with all addons', () => {
    return addonManager.addonList().then((result) => {
      assert.isArray(result, 'Should be an array');
      assert.equal(result.length, 1, 'Should equal length of 1');
    });
  });
});
