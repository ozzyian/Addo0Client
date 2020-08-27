/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const AddonManager = require('../src/services/addon_manager');

const path = require('path');
const isDev = require('electron-is-dev');

let aM;
let mainWindow;

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
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

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

ipc.on('init', async (event, args) => {
  aM = new AddonManager(args);
  const addonList = await aM.addonList();
  const installedAddonData = addonList
    .map((path) => aM.getAddonDataFromToc(path))
    .filter((addonData) => !addonData.id.includes('N/A'));
  const addons = await aM.getMultipleAddonData(
    installedAddonData.map((addon) => addon.id),
  );
  mainWindow.webContents.send('init', addons);
});

ipc.on('update', async (event, addon) => {
  const fileName = await aM.downloadFromUrl(addon);
  event.sender.send('downloaded' + addon.id);
  await aM.extractAddonFiles(fileName);
  event.sender.send('extracted' + addon.id);
  aM.deleteAddonZip(fileName);
  event.sender.send('updated' + addon.id);
});
