const fs = require('fs');
const fsPromise = fs.promises;
const fetch = require('node-fetch');
const extract = require('extract-zip');
const lineByLine = require('n-readlines');
const Addon = require('../addon');
/**
 * Handles the addons locally.
 */
class AddonManager {
  /**
   *
   * @param {*} wowPath the path to the folder with add0ns.
   */
  constructor(wowPath) {
    this.wowPath = wowPath + '/Interface/AddOns';
    this.gameVersionFlavor = 'wow_classic';
  }
  /**
   * Returns an array with names of the current addons.
   * @return {Promise} with all the dirs and failes inside a folder.
   */
  async addonList() {
    try {
      const addonList = await fsPromise.readdir(this.wowPath);
      return addonList.filter((dir) => {
        return fs.lstatSync(this.wowPath + '/' + dir).isDirectory();
      });
    } catch (e) {
      throw new Error('Could not retreive addon folders.');
    }
  }

  /**
   * @return {*}
   */

  /**
   *
   * @param {String} addon name of the addon
   * @return {Object} promise with error or object with id and/or version.
   */
  getAddonDataFromToc(addon) {
    let line;
    let idFound = false;
    const data = {};

    // not my fault the library won't adhear to common coding practises
    // eslint-disable-next-line new-cap
    const liner = new lineByLine(
      this.wowPath + '/' + addon + '/' + addon + '.toc',
    );
    while ((line = liner.next())) {
      if (line.includes('Curse-Project-ID:')) {
        data['id'] = line.toString('utf-8').replace(/[^\d.]/g, '');
        idFound = true;
      }
    }

    if (idFound) {
      return data;
    }

    return {id: 'N/A'};
  }

  /**
   *
   * @param {Object} addonData object that contains the data to be extracted
   * @return {Object}
   */
  extractDownloadData(addonData) {
    const gameVersionLatestFileData = addonData.gameVersionLatestFiles.find(
      (fileData) => fileData.gameVersionFlavor === this.gameVersionFlavor,
    );
    const latestFileData = addonData.latestFiles.find(
      (fileData) =>
        fileData.fileName === gameVersionLatestFileData.projectFileName,
    );
    return {
      url: latestFileData.downloadUrl,
      fileName: latestFileData.fileName,
    };
  }

  /**
   *
   * @param {Object} addonData
   * @return {Object}
   */
  extractLatestFileData(addonData) {
    const gameVersionLatestFileData = addonData.gameVersionLatestFiles.find(
      (fileData) => fileData.gameVersionFlavor === this.gameVersionFlavor,
    );
    const latestFileData = addonData.latestFiles.find(
      (fileData) =>
        fileData.fileName === gameVersionLatestFileData.projectFileName,
    );

    return latestFileData;
  }

  /**
   *
   * @param {String} url
   * @param {String} fileName
   */
  async downloadFromUrl(url, fileName) {
    const newAddon = await fetch(url);
    const fileStream = fs.createWriteStream(this.wowPath + '/' + fileName);
    return new Promise((resolve, reject) => {
      newAddon.body.pipe(fileStream);
      newAddon.body.on('error', (err) => {
        reject(err);
      });
      fileStream.on('finish', () => {
        resolve(this.wowPath + '/' + fileName);
      });
    });
  }

  /**
   *
   * @param {*} pathToZip path to the zipfile
   */
  async extractAddonFiles(pathToZip) {
    try {
      await extract(pathToZip, {dir: this.wowPath});
    } catch (err) {
      return err;
    }
    return true;
  }

  /**
   *
   * @param {String} zipPath path to the zipfile to be deleted
   * @return {*}
   */
  async deleteAddonZip(zipPath) {
    if (fs.existsSync(zipPath)) {
      await fsPromise.unlink(zipPath);
      return true;
    } else {
      return false;
    }
  }
  /**
   *
   * @param {String} addonId
   * @return {Promise} returns a promise that may contain an error or addon data
   */
  getAddonData(addonId) {
    return fetch(`https://addons-ecs.forgesvc.net/api/v2/addon/${addonId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => Addon.initFromJSON(data));
  }
  /**
   *
   * @param {*} addonIds
   * @return {*}
   */
  getMultipleAddonData(addonIds) {
    return fetch(`https://addons-ecs.forgesvc.net/api/v2/addon`, {
      method: 'POST',
      body: JSON.stringify(addonIds),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => response.map((data) => Addon.initFromJSON(data)));
  }

  /**
   * Returns true if there is a new version available.
   * @param {Object} currentAddonData
   * @param {Object} remoteAddonData
   * @return {Boolean}
   */
  checkForUpdate(currentAddonData, remoteAddonData) {
    const currentFileDate = new Date(
      this.extractLatestFileData(currentAddonData).fileDate,
    );
    const remoteFileDate = new Date(
      this.extractLatestFileData(remoteAddonData).fileDate,
    );

    return currentFileDate < remoteFileDate;
  }
}

module.exports = AddonManager;
