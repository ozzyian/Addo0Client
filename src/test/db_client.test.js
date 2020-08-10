const DbClient = require('../renderer/services/db_client.js');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Tests the functionality of the local database', () => {
  const db = new DbClient();
  const tempAddon = JSON.parse(
    fs.readFileSync(__dirname + '/resources/addon_info.json'),
  );
  describe('setAddonData()', () => {
    it('Adds a json object to the local database', async () => {
      const actual = await db.setAddonData(tempAddon);
      expect(actual).to.equal(true);
    });
    it('Throws an error with an invalid parameter', async () => {
      await expect(db.setAddonData(undefined)).to.be.rejectedWith(
        'Invalid parameter...',
      );
    });
  });
  describe('getAddonData()', () => {
    it('Returns an addon with the matching id', async () => {
      const res = await db.getAddonData(tempAddon.id);
      expect(res).to.deep.equal(tempAddon);
    });

    it('Throws an error with an invalid parameter', async () => {
      await expect(db.getAddonData('2')).to.be.rejectedWith(
        'Could not retrieve data from database...',
      );
    });
  });
  describe('getAddonDataSpecific', () => {
    it('Returns the id for stored addon data', async () => {
      const actual = await db.getAddonDataSpecific(tempAddon.id, 'id');
      expect(actual).to.be.equal(tempAddon.id);
    });
    it('Throws an error when specific data can not be retrieved', async () => {
      await expect(
        db.getAddonDataSpecific(tempAddon.id, 'data.does.not.exist'),
      ).to.be.rejectedWith('Could not retrieve data from database...');
    });
  });
  describe('removeAddonData()', () => {
    it('Returns true when and data was successfully removed', async () => {
      const actual = await db.removeAddonData(tempAddon.id);
      expect(actual).to.equal(true);
      await expect(db.getAddonData(tempAddon.id)).to.be.rejectedWith(
        'Could not retrieve data from database...',
      );
    });
  });
});
