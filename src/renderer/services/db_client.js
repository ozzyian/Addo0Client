const settings = require('electron-settings');
module.exports = class DbClient {
  /**
   *
   * @param {Object} addon
   */
  async setAddonData(addon) {
    try {
      await settings.set(addon.id, addon);
      return true;
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
  /**
   *
   * @param {*} addonId the id of the addon
   * @param {String} specific path to the specific data.
   */
  async getAddonDataSpecific(addonId, specific) {
    try {
      const res = await settings.get(addonId + '.' + specific);
      if (res === undefined) {
        throw new Error('Could not retrieve data from database...');
      } else {
        return res;
      }
    } catch (err) {
      throw new Error('Could not retrieve data from database...');
    }
  }

  /**
   *
   * @param {*} addonId the id of the addon data to be removed.
   */
  async removeAddonData(addonId) {
    await settings.unset(addonId);
    return true;
  }
};
