const DatabaseClient = require('../renderer/services/database_client.js');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

// Combined tests for dao.js and database_client.js.
// TODO separate dao functonality into separate test file.
describe('Tests to validate the DatabaseClient class', () => {
  let db;
  let tempAddonData;
  before(() => {
    const fileData = fs.readFileSync(__dirname + '/resources/addon_info.json');
    tempAddonData = JSON.parse(fileData);
  });
  beforeEach(async () => {
    db = new DatabaseClient('./src/test/resources/database.db');
    await db.createTable();
  });
  describe('addAddon(), getAddonData()', () => {
    it('Adds an object to the database and fetches it', async () => {
      const addRes = await db.addAddonData(tempAddonData);
      const res = await db.getAddonData(tempAddonData.id);
      const actual = JSON.parse(res.data);

      expect(addRes).to.deep.equal({
        lastID: undefined,
        changes: undefined,
      });
      expect(actual).to.deep.equal(tempAddonData);
    });
    it('Throws an error when trying to add addon with same id', async () => {
      await expect(db.addAddonData(tempAddonData)).to.be.rejectedWith(
        'UNIQUE constraint failed: addons.id',
      );
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.getAddonData(tempAddonData.id)).to.be.rejectedWith(
        'no such table: addons',
      );
    });
  });

  describe('getAll()', () => {
    it('Returns all the rows in the database', async () => {
      await db.addAddonData(tempAddonData);
      const expected = tempAddonData;
      const actual = await db.getAll();
      expect(JSON.parse(actual[0].data)).to.deep.equal(expected);
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.getAll()).to.be.rejectedWith('no such table: addons');
    });
  });
  describe('deleteAddonData()', () => {
    it('Should successfully delete an entry in the database', async () => {
      const res = await db.deleteAddonData(tempAddonData.id);
      expect(res).to.deep.equal({
        lastID: undefined,
        changes: undefined,
      });
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.deleteAddonData(tempAddonData.id)).to.be.rejectedWith(
        'no such table: addons',
      );
    });
  });
});
