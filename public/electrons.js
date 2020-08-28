/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const DatabaseClient = require('../src/db/database_client');
const AddonManager = require('../src/services/addon_manager');

const path = require('path');
const isDev = require('electron-is-dev');

let aM;
let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {nodeIntegration: true, webSecurity: false},
  });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );
  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  db = new DatabaseClient(':memory:');
}

app.on('ready', () => {
  createWindow();
  db = new DatabaseClient(':memory:');
  ipc.handle('init-with-path', async (event, path) => {
    await db.createSettingsTable();
    const res = await db.addPath(path);
    console.log(res);
    if (res === undefined) {
      mainWindow.webContents.send('not-initiated');
      return;
    }

    await db.createTable();
    const savedAddons = await db.getAll();
    mainWindow.webContents.send(
      'already-initiated',
      savedAddons.map((data) => JSON.parse(data.data)),
    );
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('set-path', async (event, path) => {
  await db.addPath(path);
  aM = new AddonManager(path);
  const addonList = await aM.addonList();
  const addonIds = addonList
    .map((addon) => aM.getAddonDataFromToc(addon).id)
    .filter((addonData) => addonData !== 'N/A');
  console.log(addonIds);
  const addons = await aM.getMultipleAddonData(addonIds);
  mainWindow.webContents.send('init', addons);
});

ipc.on('load-data', async () => {
  await db.createTable();
  const savedAddons = await db.getAll();
  if (savedAddons.length > 0) {
    mainWindow.webContents.send(
      'data-loaded',
      savedAddons.map((data) => JSON.parse(data.data)),
    );
  } else {
  }
});

ipc.on('load', (event) => {});

ipc.on('update', async (event, addon) => {
  const fileName = await aM.downloadFromUrl(addon);
  event.sender.send('downloaded' + addon.id);
  await aM.extractAddonFiles(fileName);
  event.sender.send('extracted' + addon.id);
  aM.deleteAddonZip(fileName);
  event.sender.send('updated' + addon.id);
});
