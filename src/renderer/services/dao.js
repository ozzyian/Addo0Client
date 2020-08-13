const sqlite = require('sqlite3');

module.exports = class DatabaseAccessObject {
  /**
   *
   * @param {String} dbPath path to the database location
   */
  constructor(dbPath) {
    this.db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        return err;
      } else {
        this.connected = true;
      }
    });
  }
  /**
   *
   * @return {Promise}
   */
  async run(...args) {
    return new Promise((resolve, reject) => {
      const callback = (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes,
          });
        }
      };
      args.push(callback);
      this.db.run(...(this.db, args));
    });
  }

  /**
   *
   * @return {Promise}
   */
  get(...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      };
      args.push(callback);
      this.db.get(...(this.db, args));
    });
  }
  /**
   *
   * @return {Promise}
   */
  all(...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      };
      args.push(callback);
      this.db.all(...(this.db, args));
    });
  }
};
