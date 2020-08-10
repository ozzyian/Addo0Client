const fs = require('fs');
const fetch = require('node-fetch');
const lineByLine = require('n-readlines');
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
   * @return {Promise} with all the dirs and failes inside a folder.
   */
  addonList() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.wowPath, (err, files) => {
        err
          ? reject(new Error('Folder does not contain any elements...'))
          : resolve(files);
      });
    });
  }
  /**
   *
   * @param {String} tocFile path to the toc file
   * @return {Promise} promise with error or object with id and/or version.
   */
  async getAddonDataFromToc(tocFile) {
    let line;
    let idFound = false;
    const data = {};

    // not my fault the library won't adhear to common coding practises
    // eslint-disable-next-line new-cap
    const liner = new lineByLine(this.wowPath + '/' + tocFile);
    while ((line = liner.next())) {
      if (line.includes('Curse-Project-ID:')) {
        data['id'] = line.toString('utf-8').replace(/[^\d.]/g, '');
        idFound = true;
      }
      if (line.includes('Version:')) {
        data['version'] = line.toString('utf-8').replace(/[^\d.]/g, '');
      }
    }

    if (idFound) {
      return data;
    }

    throw new Error('Could not find an ID');
  }

  /**
   *
   * @param {String} addonId
   * @return {Promise} returns a promise that may contain an error or addon data
   */
  async getAddonData(addonId) {
    try {
      const response = await fetch(
        `https://addons-ecs.forgesvc.net/api/v2/addon/${addonId}`,
      );
      return response.json();
    } catch (err) {
      return err;
    }
  }
};
