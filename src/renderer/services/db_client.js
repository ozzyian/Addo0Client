const settings = require('electron-settings');
module.exports = class DbClient {
  /**
   *
   * @param {Object} addon
   */
  async setAddonData(addon) {
    try {
      return await settings.set(addon.id, addon);
    } catch (err) {
      throw new Error('Invalid parameter...');
    }
  }
  /**
   *
   * @param {String} addonId
   */
  async getAddonData(addonId) {
    try {
      const res = await settings.get(addonId);
      if (res === undefined) {
        throw new Error('Could not retrieve data from database...');
      } else {
        return res;
      }
    } catch (err) {
      throw new Error('Could not retrieve data from database...');
    }
  }
};
