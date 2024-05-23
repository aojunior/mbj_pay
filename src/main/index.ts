import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount } from '@shared/api'

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1020,
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
      devTools: true
      // contextIsolation: true,
    },
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
  createPath();
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  watchFileAndFormat( (formatData) => {
    mainWindow.webContents.send('file', formatData);
  });
 
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
  
  if (app.isReady()) {
    ipcMain.on('token_generator',  async () => {
      let token = await tokenGenerator()
      mainWindow.webContents.send('access_token', token)
    });
  }

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

// IPC Preloader creates
ipcMain.on('message', (_, args) => {
  console.log(args.msg)
});

ipcMain.on('create_account', async(_, args) => {
  let newAccount = await createAccount(args.data, args.token)
  console.log(newAccount)
});


