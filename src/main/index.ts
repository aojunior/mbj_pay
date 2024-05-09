import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, watchFileAndFormat  } from './lib'

let mainWindow: BrowserWindow;
let count = 0;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,
    // autoHideMenuBar: true,
    resizable: false,
    fullscreenable: false,
    // closable: false,
    center: true,
    title: 'MBJ PAY',
    frame: true,
    trafficLightPosition: {x:15, y:15},
    ...(process.platform === 'linux' ? { icon } : {icon}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // contextIsolation: true,
    },

  // mainWindow.webContents.send('file', watchFileAndFormat)
  });


  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  };
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mbjpay');
  createWindow();
 
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  watchFileAndFormat( (formatData) => {
    mainWindow.webContents.send('file', formatData);
  });
  
  ipcMain.handle('create-paths', (event) => {
    createPath();
    return true;
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

ipcMain.on('message', (_, args) => {
  count = args.count
  console.log(args.msg)
});

// setInterval(() => {mainWindow.webContents.send("count", count++)}, 1000);
