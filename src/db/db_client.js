import Dexie from 'dexie';

/**
 *
 */
class DatabaseClient {
  /**
   *
   * @param {*} dbName
   */
  constructor(dbName) {
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
      addons: '',
    });
  }

  /**
   *
   * @param {*} addon
   * @return {*}
   */
  insertData(addon) {
    return this.db.addons.put(addon, addon.id);
  }

  /**
   *
   * @param {*} addonId
   * @return {*}
   */
  selectData(addonId) {
    return this.db.addons.get(addonId);
  }

  /**
   * @return {Promise};
   */
  getAll() {
    return this.db.addons.toArray();
  }

  /**
   *
   * @param {*} addonId
   * @return {*}
   */
  deleteData(addonId) {
    return this.db.addons.delete(addonId);
  }
}

export default DatabaseClient;
