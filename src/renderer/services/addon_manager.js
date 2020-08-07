const fs = require('fs');

/**
 * Handles the addons locally.
 */
module.exports = class AddonManager {
  /**
   *
   * @param {*} wowPath the path to the folder with add0ns.
   */
  constructor(wowPath) {
    this.wowPath = wowPath;
  }
  /**
   * Returns an array with names of the current addons.
   */
  async addonList() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.wowPath, (err, files) => {
        err ? reject(err) : resolve(files);
      });
    });
  }
};
