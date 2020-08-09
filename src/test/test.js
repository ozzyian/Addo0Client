const AddonManager = require('../renderer/services/addon_manager.js');
const fs = require('fs');
const fsPromises = fs.promises;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const tmp = require('tmp');
const nock = require('nock');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Tests the functionality of the AddonManager class.', () => {
  describe('addonList()', () => {
    it('Returns array with all addons.', async () => {
      const tmpDir = tmp.dirSync();
      const tmpFile = tmp.fileSync({dir: tmpDir.name});

      const aM = new AddonManager(tmpDir.name);
      const expected = await fsPromises.readdir(tmpDir.name);
      const actual = await aM.addonList();

      expect(actual).to.deep.equal(
        expected,
        'actual and expected have equal first element',
      );
      tmpFile.removeCallback();
      tmpDir.removeCallback();
    });
    it('Returns an error when dir is not an actual directory', async () => {
      const aM = new AddonManager('NON EXISTING DIR');
      await expect(aM.addonList()).to.be.rejectedWith(
        'Folder does not contain any elements...',
      );
    });
  });
  describe('getAddonDataFromToc()', () => {
    it('Returns the data of a given file (id and version)', async () => {
      const fileName = 'tempToc.toc';
      const tmpDir = tmp.dirSync();
      const tmpobj = tmp.fileSync({dir: tmpDir.name, name: fileName});
      fs.writeFileSync(
        tmpobj.name,
        '## X-Curse-Project-ID: 3358\n## Version: 1.13.55',
      );
      const aM = new AddonManager(tmpDir.name);
      const data = await aM.getAddonDataFromToc(fileName);
      const expected = {id: '3358', version: '1.13.55'};
      expect(data).to.deep.equal(expected);
      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });

    it('Returns the id of a given file', async () => {
      const fileName = 'tempTocNoVersion.toc';
      const tmpDir = tmp.dirSync();
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: fileName,
      });
      fs.writeFileSync(tmpobj.name, '## X-Curse-Project-ID: 3358');

      const aM = new AddonManager(tmpDir.name);
      const data = await aM.getAddonDataFromToc(fileName);
      const expected = {id: '3358'};
      expect(data).to.deep.equal(expected);
      expect(data).to.not.have.property('version');

      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });

    it('Returns the version of a given file', async () => {
      const fileName = 'tempTocNoID.toc';
      const tmpDir = tmp.dirSync();
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: fileName,
      });
      fs.writeFileSync(tmpobj.name, '## Version: 1.13.55');

      const aM = new AddonManager(tmpDir.name);
      const data = await aM.getAddonDataFromToc(fileName);
      const expected = {version: '1.13.55'};
      expect(data).to.deep.equal(expected);
      expect(data).to.not.have.property('id');

      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });

    it('Returns an error since theres no ID inside the file', async () => {
      const fileName = 'tempTocNada.toc';
      const tmpDir = tmp.dirSync();
      const tmpobj = tmp.fileSync({
        dir: tmpDir.name,
        name: fileName,
      });
      fs.writeFileSync(tmpobj.name, 'non id line...');

      const aM = new AddonManager(tmpDir.name);
      await expect(aM.getAddonDataFromToc(fileName)).to.be.rejectedWith(
        'Could not find an ID',
      );
      tmpobj.removeCallback();
      tmpDir.removeCallback();
    });
  });
  describe('getAddonInfo()', () => {
    const rawdata = fs.readFileSync(__dirname + '/resources/addon_info.json');
    const response = JSON.parse(rawdata);
    nock('https://addons-ecs.forgesvc.net/api/v2/addon')
      .get('/3358')
      .reply(200, response);
    nock('https://addons-ecs.forgesvc.net/api/v2/addon').get('/8').reply(500);
    const aM = new AddonManager(__dirname);

    it('Returns the correct json response for a valid id', async () => {
      const actual = await aM.getAddonData('3358');
      expect(actual).to.deep.equal(response);
    });

    it('Throws an error when addon data cant be fetched', async () => {
      const aM = new AddonManager(__dirname);
      await expect(aM.getAddonData('8')).to.be.rejectedWith(
        'invalid json response body at https://addons-ecs.forgesvc.net/api/v2/addon/8 reason: Unexpected end of JSON input',
      );
    });
  });
});
