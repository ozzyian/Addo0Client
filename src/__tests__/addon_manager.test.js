/* eslint-disable max-len */
import AddonManager from '../services/addon_manager.js';
import Addon from '../addon';
import fs from 'fs';
import tmp from 'tmp';
import nock from 'nock';

describe('Tests the functionality of the AddonManager class.', () => {
  let tmpDirWow;
  let tmpDirInterface;
  let tmpDirAddons;
  afterAll(() => {
    tmpDirAddons.removeCallback();
    tmpDirInterface.removeCallback();
    tmpDirAddons.removeCallback();
  });
  beforeAll(() => {
    tmpDirWow = tmp.dirSync();
    tmpDirInterface = tmp.dirSync({
      name: 'Interface',
      dir: tmpDirWow.name,
    });
    tmpDirAddons = tmp.dirSync({
      dir: tmpDirInterface.name,
      name: 'AddOns',
    });
  });
  describe('addonList()', () => {
    it('Returns array with all addons.', async () => {
      const tempDir = tmp.dirSync({
        name: 'tempAddonDir',
        dir: tmpDirAddons.name,
      });
      const aM = new AddonManager(tmpDirWow.name);
      const expected = ['tempAddonDir'];
      const actual = await aM.addonList();
      expect(actual).toEqual(
        expected,
        'actual and expected have equal first element',
      );
      tempDir.removeCallback();
    });
    it('Returns an error when dir is not an actual directory', async () => {
      const aM = new AddonManager('NON EXISTING DIR');
      expect(aM.addonList()).rejects.toThrow();
    });
  });
  describe('getAddonDataFromToc()', () => {
    it('Returns the id of a given file', async () => {
      const tmpDir = tmp.dirSync({
        dir: tmpDirAddons.name,
        name: 'tempTocNoVersion',
      });
      const fileName = 'tempTocNoVersion.toc';
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: fileName,
      });
      fs.writeFileSync(tmpobj.name, '## X-Curse-Project-ID: 3358');

      const aM = new AddonManager(tmpDirWow.name);
      const data = await aM.getAddonDataFromToc('tempTocNoVersion');
      const expected = {id: '3358'};
      expect(data).toEqual(expected);

      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });

    it('Returns the version of a given file', async () => {
      const tmpDir = tmp.dirSync({
        dir: tmpDirAddons.name,
        name: 'tempTocID',
      });
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: 'tempTocID.toc',
      });
      fs.writeFileSync(tmpobj.name, '## X-Curse-Project-ID: 3358');

      const aM = new AddonManager(tmpDirWow.name);
      const data = await aM.getAddonDataFromToc('tempTocID');
      const expected = {id: '3358'};
      expect(data).toEqual(expected);

      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });

    it('Returns N/A since theres no ID inside the file', async () => {
      const tmpDir = tmp.dirSync({
        dir: tmpDirAddons.name,
        name: 'tempTocNada',
      });
      const fileName = 'tempTocNada.toc';
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: fileName,
      });
      fs.writeFileSync(tmpobj.name, 'non id line...');

      const aM = new AddonManager(tmpDirWow.name);
      expect(aM.getAddonDataFromToc('tempTocNada')).toEqual({id: 'N/A'});

      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });
  });
  describe('getAddonData()', () => {
    const rawdata = fs.readFileSync(__dirname + '/resources/addon_info.json');
    const response = JSON.parse(rawdata);
    nock('https://addons-ecs.forgesvc.net/api/v2/addon')
      .get('/3358')
      .reply(200, response);
    nock('https://addons-ecs.forgesvc.net/api/v2/addon').get('/8').reply(500);
    const aM = new AddonManager(__dirname);

    it('Returns the correct json response for a valid id', async () => {
      const actual = await aM.getAddonData(3358);
      expect(actual).toEqual(Addon.initFromJSON(response));
    });

    it('Throws an error when addon data cant be fetched', async () => {
      const aM = new AddonManager(__dirname);
      await expect(aM.getAddonData('8')).rejects.toEqual(
        new Error(
          'invalid json response body at https://addons-ecs.forgesvc.net/api/v2/addon/8 reason: Unexpected end of JSON input',
        ),
      );
    });
  });
  describe('getMultipleAddonData()', () => {
    it('Returns correct response from output', async () => {
      const aM = new AddonManager(__dirname);
      const rawdata = fs.readFileSync(__dirname + '/resources/addon_info.json');
      const response = JSON.parse(rawdata);
      const addon = Addon.initFromJSON(response);
      nock('https://addons-ecs.forgesvc.net/api/v2')
        .post('/addon', [3358, 3358, 3358])
        .reply(200, [response]);
      const actual = await aM.getMultipleAddonData([3358, 3358, 3358]);
      expect(actual).toEqual([addon]);
    });
  });

  describe('extractAddonFiles()', () => {
    it('Extracts the contents of the zip file to the correct dir', async () => {
      const dirPath = __dirname + '/resources/Interface/AddOns';
      const aM = new AddonManager(__dirname + '/resources');
      const res = await aM.extractAddonFiles(
        __dirname +
          '/resources/Interface/AddOns/AdvancedInterfaceOptions-1.3.4-classic.zip',
      );
      expect(res).toBe(true);
      const dirContents = fs.readdirSync(dirPath);
      expect(dirContents).toEqual([
        'AdvancedInterfaceOptions',
        'AdvancedInterfaceOptions-1.3.4-classic.zip',
      ]);
    });
  });

  describe('checkForUpdate', () => {
    it('Returns the correct value if update is available or not', () => {
      const aM = new AddonManager(__dirname);
      const rawdata = fs.readFileSync(__dirname + '/resources/addon_info.json');
      const currentVersion = Addon.initFromJSON(JSON.parse(rawdata));

      const newDate = new Date('2020-08-26T23:07:17.033Z');
      expect(aM.checkForUpdate(currentVersion.getDate(), newDate)).toBe(true);
      expect(
        aM.checkForUpdate(currentVersion.getDate(), currentVersion.getDate()),
      ).toBe(false);
    });
  });

  describe('deleteAddonZip()', () => {
    it('deletes the zip folder', async () => {
      const zip = tmp.fileSync({
        name: 'tempFile',
        dir: tmpDirAddons.name,
      });
      const aM = new AddonManager(tmpDirWow.name);
      await aM.deleteAddonZip(zip.name);
      const actual = fs.existsSync(zip.name);
      expect(actual).toBe(false);
    });
    it('Returns false if file to delete does not exist', async () => {
      const aM = new AddonManager(__dirname);
      expect(await aM.deleteAddonZip('non existing file')).toBe(false);
    });
  });
});
