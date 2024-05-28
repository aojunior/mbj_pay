import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount, VerifyAccount, createAliases, verifyAliases } from '@shared/api'
import { dbAlter, dbCreate, dbInsert, dbRead } from '@shared/database'


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

app.whenReady().then( () => {
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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

// IPC Preloader creates

ipcMain.on('token_generator',  async () => {
  console.log()
  let token = await tokenGenerator()
  mainWindow.webContents.send('access_token', token)
});

ipcMain.on('message', (_, args) => {
  console.log(args.msg)
});

ipcMain.on('create_account', async(_, args) => {
  let newAccount = await createAccount(args.data, args.token)

  let data = {
    AccId: newAccount.data.account.accountId,
    AccHID: newAccount.data.accountHolderId,
    Cnpj: args.data.companyDocument,
    Tel: args.data.companyPhoneNumber
  }
  await dbInsert(data)
});

ipcMain.on('verify_account', async(_, args) => {
  let consulta = await VerifyAccount(args)

  console.log(consulta)
})

ipcMain.on('create_alias', async(_, args) => {
  let alias = await createAliases(args)
  console.log(alias)
})

ipcMain.on('verify_alias', async(_, args) => {
  const data = await dbRead()
  console.log(data)
  // let consulta = await verifyAliases(args)
  // await dbAlter(consulta.response.data.aliases[0].name, consulta.AccountID)
})