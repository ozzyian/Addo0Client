/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
'use strict';

const {app, BrowserWindow} = require('electron');
const path = require('path');
const {format} = require('url');

let isDevelopment;
if (process.env.NODE_ENV !== 'production') {
  isDevelopment = false;
} else if (process.env.NODE_ENV !== 'testing') {
  isDevelopment = false;
} else {
  isDevelopment = true;
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
      }),
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
