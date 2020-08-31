/* eslint-disable max-len */
import fs from 'fs';
import Addon from '../addon';

let addonData;

describe('Tests for the factory class Addon', () => {
  beforeAll(() => {
    const rawdata = fs.readFileSync(__dirname + '/resources/addon_info.json');
    addonData = JSON.parse(rawdata);
  });
  describe('Testing that the constructor generates the instance correctly', () => {
    it('Extracts the latest file data from the addon data', () => {
      const actual = Addon.extractLatestFileData(
        addonData.latestFiles,
        addonData.gameVersionLatestFiles,
      );
      const expected = addonData.latestFiles[4];
      expect(actual).toEqual(expected);
    });
    it('Returns the correct values when creating json instance', () => {
      const addon = Addon.initFromJSON(addonData);
      expect(addon.getId()).toEqual(addonData.id);
      expect(addon.getName()).toEqual(addonData.name);
      expect(addon.getAuthors()).toEqual(addonData.authors);
      expect(addon.getName()).toEqual(addonData.name);
      expect(
        addon.getFileData(
          addonData.latestFiles,
          addonData.gameVersionLatestFiles,
        ),
      ).toEqual(addonData.latestFiles[4]);

      expect(addon.getDownloadUrl()).toEqual(
        addonData.latestFiles[4].downloadUrl,
      );
      expect(addon.getDate()).toEqual(
        new Date(addonData.latestFiles[4].fileDate),
      );
      expect(addon.getVersionName()).toEqual(
        addonData.latestFiles[4].displayName,
      );
      expect(addon.getFileName()).toEqual(addonData.latestFiles[4].fileName);
    });
    it('Returns the correct values when creating instance from db', () => {
      const expectedFileData = addonData.latestFiles[4];
      const expected = {
        id: addonData.id,
        name: addonData.name,
        authors: addonData.authors,
        fileData: expectedFileData,
        downloadUrl: expectedFileData.downloadUrl,
        date: new Date(expectedFileData.fileDate),
        fileName: expectedFileData.fileName,
        versionName: expectedFileData.displayName,
      };
      const actual = new Addon(expected);
      expect(actual).toEqual(expected);
    });
    it('Returns correct value after json->addon->db->addon operations', () => {
      const jsonToAddon = Addon.initFromJSON(addonData);
      const expectedFileData = addonData.latestFiles[4];
      const expectedAddon = {
        gameVersionFlavor: 'wow_classic',
        id: addonData.id,
        name: addonData.name,
        authors: addonData.authors,
        fileData: expectedFileData,
        downloadUrl: expectedFileData.downloadUrl,
        fileName: expectedFileData.fileName,
        date: new Date(expectedFileData.fileDate),
        versionName: expectedFileData.displayName,
      };
      expect(jsonToAddon).toEqual(expectedAddon);

      const expectedDbAddon = {
        id: addonData.id,
        data: JSON.stringify(expectedAddon),
      };
      const addonFromDb = new Addon(JSON.parse(expectedDbAddon.data));
      expect(addonFromDb).toEqual(expectedAddon);
    });
  });
});
