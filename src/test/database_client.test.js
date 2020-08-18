const DatabaseClient = require('../electron/services/database_client.js');
const fs = require('fs');

// Combined tests for dao.js and database_client.js.
// TODO separate dao functonality into separate test file.
describe('Tests to validate the DatabaseClient class', () => {
  let db;
  let tempAddonData;
  beforeAll(() => {
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
        lastID: undefined,
        changes: undefined,
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
  describe('deleteAddonData()', () => {
    it('Should successfully delete an entry in the database', async () => {
      const res = await db.deleteAddonData(tempAddonData.id);
      expect(res).toEqual({
        lastID: undefined,
        changes: undefined,
      });
    });
    it('Throws an error when table does not exist', async () => {
      await db.resetDatabase();
      await expect(db.deleteAddonData(tempAddonData.id)).rejects.toThrow();
    });
  });
});
