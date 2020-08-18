const DatabaseAccessObject = require('./dao.js');

module.exports = class DatabaseClient {
  /**
   *
   * @param {*} dbPath type of the database
   */
  constructor(dbPath) {
    this.dao = new DatabaseAccessObject(dbPath);
  }
  /**
   *
   * @param {Object} addon
   * @return {Promise}
   */
  addAddonData(addon) {
    const data = JSON.stringify(addon);
    return this.dao.run('INSERT INTO addons (id, data) VALUES (?,?)', [
      addon.id,
      data,
    ]);
  }
  /**
   *
   * @param {*} addonId the id of the addon to fetch
   * @return {Promise} resolves to error or JSON as String
   */
  getAddonData(addonId) {
    return this.dao.get(`SELECT * FROM addons WHERE id = ?`, [addonId]);
  }

  /**
   * @return {Promis}
   */
  getAll() {
    return this.dao.all(`SELECT * FROM addons`);
  }

  /**
   * Get addon data by the id
   * @param {*} addonId
   * @return {Promise}
   */
  deleteAddonData(addonId) {
    return this.dao.run(`DELETE FROM addons WHERE id = ?`, [addonId]);
  }

  /**
   * Creates a table calle addons
   * @return {Promise}
   */
  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS addons (
      id INTEGER PRIMARY KEY,
      data TEXT)`;
    return this.dao.run(sql);
  }

  /**
   * Deletes the addons table with all stored data
   * @return {Promise}
   */
  resetDatabase() {
    const sql = `DROP TABLE addons`;
    return this.dao.run(sql);
  }
};
