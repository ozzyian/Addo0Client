const AddonManager = require('../renderer/services/addon_manager.js');
const fs = require('fs');
const fsPromises = fs.promises;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const tmp = require('tmp');
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
      const tmpobj = tmp.fileSync();
      fs.writeFileSync(
        tmpobj.name,
        '## X-Curse-Project-ID: 3358\n## Version: 1.13.55',
      );
      const aM = new AddonManager(__dirname);
      const data = await aM.getAddonDataFromToc(tmpobj.name);
      const expected = {id: '3358', version: '1.13.55'};
      expect(data).to.deep.equal(expected);
      tmpobj.removeCallback();
    });

    it('Returns the id of a given file', async () => {
      const tmpobj = tmp.fileSync();
      fs.writeFileSync(tmpobj.name, '## X-Curse-Project-ID: 3358');

      const aM = new AddonManager(__dirname);
      const data = await aM.getAddonDataFromToc(tmpobj.name);
      const expected = {id: '3358'};
      expect(data).to.deep.equal(expected);
      expect(data).to.not.have.property('version');

      tmpobj.removeCallback();
    });

    it('Returns the version of a given file', async () => {
      const tmpobj = tmp.fileSync();
      fs.writeFileSync(tmpobj.name, '## Version: 1.13.55');

      const aM = new AddonManager(__dirname);
      const data = await aM.getAddonDataFromToc(tmpobj.name);
      const expected = {version: '1.13.55'};
      expect(data).to.deep.equal(expected);
      expect(data).to.not.have.property('id');

      tmpobj.removeCallback();
    });

    it('Returns an error since theres no ID inside the file', async () => {
      const tmpobj = tmp.fileSync();
      fs.writeFileSync(tmpobj.name, 'non id line...');

      const aM = new AddonManager(__dirname);
      await expect(aM.getAddonDataFromToc(tmpobj.name)).to.be.rejectedWith(
        'Could not find an ID',
      );
      tmpobj.removeCallback();
    });
  });
});
