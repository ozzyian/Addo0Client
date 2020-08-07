const fs = require('fs');
// const lineReader = require('line-reader');

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
   * @return {String[]} Array with addon folders.
   */
  addonList() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.wowPath, (err, files) => {
        err ? reject(err) : resolve(files);
      });
    });
  }
  /**
   *
   * @param {*} addonPath
   * @return {Promise}
   */
  readLinesFromToc(addonPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(addonPath, 'utf8', (err, content) => {
        err ? reject(err) : resolve(content);
      });
    });
  }
  /**
   *
   * @param {*} tocData
   * @return {String} The extracted curse id.
   */
  async validateAddonCurseId(tocData) {
    for (i = 0; i < tocData.length; i++) {
      if (tocData[i].includes('## X-Curse-Project-ID:')) {
        return tocData[i].replace(/[^0-9]/g, '');
      }
    }
  }
};
