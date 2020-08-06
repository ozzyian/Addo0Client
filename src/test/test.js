const AddonManager = require("../renderer/services/addon_manager.js");
var assert = require('chai').assert;

let addonManager = new AddonManager(__dirname);


describe("Get list of addons", () => {
    it("Returns array with all addons", () => {
      return addonManager.addonList().then(result => {
        assert.isArray(result, "Should be an array")
        assert.equal(result.length, );
      })
    })
  })

  