const DatabaseClient = require('../db/database_client');
const fs = require('fs');

// Combined tests for dao.js and database_client.js.
// TODO separate dao functonality into separate test file.
describe('Tests to validate the DatabaseClient class', () => {
  let db;
  let tempAddonData;
  beforeAll(async () => {
    const fileData = fs.readFileSync(__dirname + '/resources/addon_info.json');
    tempAddonData = JSON.parse(fileData);
  });
  beforeEach(async () => {
    db = new DatabaseClient(':memory:');
    await db.createTable();
  });
  describe('addAddon(), getAddonData()', () => {
    it('Adds an object to the database and fetches it', async () => {
      const addRes = await db.addAddonData(tempAddonData);
      const res = await db.getAddonData(tempAddonData.id);
      const actual = JSON.parse(res.data);

      expect(addRes).toEqual({
        lastID: 3358,
        changes: 1,
      });
      expect(actual).toEqual(tempAddonData);
    });
    it('Throws an error when trying to add addon with same id', async () => {
      await db.addAddonData(tempAddonData);
      await expect(db.addAddonData(tempAddonData)).rejects.toThrow();
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.getAddonData(tempAddonData.id)).rejects.toThrow();
    });
  });

  describe('getAll()', () => {
    it('Returns all the rows in the database', async () => {
      await db.addAddonData(tempAddonData);
      const expected = tempAddonData;
      const actual = await db.getAll();
      expect(JSON.parse(actual[0].data)).toEqual(expected);
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.getAll()).rejects.toThrow();
    });
  });

  describe('updateAddonData()', () => {
    it('updates the specific row ', async () => {
      await db.addAddonData(tempAddonData);
      tempAddonData.name = 'DBM';
      const res = await db.updateAddonData(tempAddonData);
      expect(res).toEqual({lastID: 3358, changes: 1});
      const actual = await db.getAddonData(tempAddonData.id);
      expect(JSON.parse(actual.data)).toEqual(tempAddonData);
    });
  });
  describe('deleteAddonData()', () => {
    it('Should successfully delete an entry in the database', async () => {
      const res = await db.deleteAddonData(tempAddonData.id);
      expect(res).toEqual({
        lastID: 0,
        changes: 0,
      });
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.deleteAddonData(tempAddonData.id)).rejects.toThrow();
    });
  });
  describe('getPath()', () => {
    it('Returns the stored path ', async () => {
      const expected = 'a/test/path';
      await db.createSettingsTable();
      await db.addPath(expected);
      const actual = await db.getPath();
      expect(actual.data).toEqual(expected);
    });
  });
});
