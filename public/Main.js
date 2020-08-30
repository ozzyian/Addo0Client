const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const DatabaseClient = require('../src/db/database_client');
const AddonManager = require('../src/services/addon_manager');

/**
 *
 */
class Main {
  /**
   *
   */
  constructor() {
    this.db = new DatabaseClient(':memory:');
  }

  /**
   *
   */
  async init() {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    ipcMain.handle('app-load', async (event, args) => {
      await this.db.createSettingsTable();
      await this.db.createTable();

      const path = await this.db.getPath();
      if (path === undefined) {
        return false;
      }
      this.aM = new AddonManager(path);
      const savedAddons = await this.db.getAll();
      if (savedAddons.length !== 0) {
        return savedAddons.map((addon) => JSON.parse(addon.data));
      } else {
        return [];
      }
    });

    ipcMain.handle('init-with-path', async (_, path) => {
      await this.setAddonPath(path);
      return await this.importAddons();
    });

    ipcMain.handle('update', async (_, addon) => {
      const filePath = await this.aM.downloadFromUrl(addon);

      const extracted = await this.aM.extractAddonFiles(filePath);

      const deleted = await this.aM.deleteAddonZip(filePath);

      await this.db.updateAddonData(addon);

      return extracted && deleted;
    });
  }

  /**
   *
   */
  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  /**
   *
   */
  onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }
  /**
   *
   */
  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 1000,
      webPreferences: {nodeIntegration: true, webSecurity: false},
    });
    this.mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`,
    );
    if (isDev) {
      // Open the DevTools.
      this.mainWindow.webContents.openDevTools();
    }
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  /**
   *
   * @param {String} path
   */
  async setAddonPath(path) {
    try {
      await this.db.addPath(path);
      this.aM = new AddonManager(path);
      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   */
  async importAddons() {
    const addonList = await this.aM.addonList();
    const addonIds = addonList
      .map((addon) => this.aM.getAddonDataFromToc(addon).id)
      .filter((addonData) => addonData !== 'N/A');
    const addons = await this.aM.getMultipleAddonData(addonIds);
    const dbInserts = addons.map((addon) => this.db.addAddonData(addon));
    await Promise.all(dbInserts);
    return addons;
  }
}

module.exports = Main;
