import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount, VerifyAccount, createAliases, verifyAliases, createInstantPayment } from '@shared/api'
import { dbAlter, dbInsert } from '@shared/database'


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
    autoHideMenuBar: true,
    center: true,
    title: 'MBJ PAY',
    frame: true,
    trafficLightPosition: {x:15, y:15},
    ...(process.platform === 'linux' ? { icon } : {icon}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      devTools: true,
      // contextIsolation: true,
      // contextIsolation: true,
    },
  
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  // mainWindow.webContents.setWindowOpenHandler((details) => {
  //   shell.openExternal(details.url);
  //   return { action: 'deny' };
  // });

  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  // };
  mainWindow.loadURL('http://localhost:5173');

};

app.whenReady().then( () => {
  electronApp.setAppUserModelId('com.mbjpay');
  createWindow();
  createPath();

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  watchFileAndFormat( async (formatData) => {
    let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);

    let data = await createInstantPayment(formatData, token)

    console.log(data)
    mainWindow.webContents.send('file', data);

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

// cross-screen navigation
ipcMain.on('navigate', (_, route) => {
  mainWindow.loadURL(`http://localhost:5173${route}`);
});

ipcMain.on('token_generator',  async () => {
  console.log()
  let token = await tokenGenerator()
  mainWindow.webContents.send('access_token', token)
});

ipcMain.on('message', (_, args) => {
  console.log(args.msg)
});

ipcMain.on('create_account', async(_, args) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  let newAccount = await createAccount(args.data, token)

  let data = {
    AccId: newAccount.data.account.accountId,
    AccHID: newAccount.data.accountHolderId,
    Acc: newAccount.data.account.account,
    Branch: newAccount.data.account.branch,
    Cnpj: args.data.companyDocument,
    Tel: args.data.companyPhoneNumber
  }
  await dbInsert(data)
});

ipcMain.on('verify_account', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  let consulta = await VerifyAccount(token)

  console.log(consulta)
})

ipcMain.on('create_alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);

  let alias = await createAliases(token)
  console.log(alias)
})

ipcMain.on('verify_alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  // const data = await dbRead()
  // console.log(data)
  let consulta = await verifyAliases(token)
  console.log(consulta.response.data)
  await dbAlter(consulta.response.data.aliases[0].name, consulta.AccountID)
}) 