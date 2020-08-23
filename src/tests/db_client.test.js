import 'fake-indexeddb/auto';
import DatabaseClient from '../db/db_client';

describe('Tests the functionality of the database', () => {
  let db;
  beforeAll(() => {
    db = new DatabaseClient('test');
  });
  describe('insertData()', () => {
    it('adds a object to the database', async () => {
      const res = await db.insertData({id: 1, data: ''});
      expect(res).toEqual(1);
    });
  });
  describe('selectData()', () => {
    it('returns a row from the database', async () => {
      const res = await db.selectData(1);
      expect(res).toEqual({id: 1, data: ''});
    });
  });
  describe('deleteData()', () => {
    it('delets a row from the database', async () => {
      const res = await db.deleteData(1);
      expect(res).toEqual(undefined);
      const get = await db.selectData(1);
      expect(get).toEqual(undefined);
    });
  });
});
