import { app, BrowserWindow,  ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, removeReqAndCreateRes, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount, VerifyAccount, createAliases, verifyAliases, createInstantPayment, verifyInstantPayment, verifyBalance, extractBalanceToday, extractBalanceFilter, refundInstantPayment, refundCodes } from '@shared/api'
import { dbCreate, dbInsertAlias, dbInsertClient, dbRead, dbReadActiveAlias, dbUpdateClient } from '@shared/database'
import AutoLaunch from 'auto-launch'


// import { createFileRoute, createURLRoute } from 'electron-router-dom'

let mainWindow: BrowserWindow;
let tray: Tray;
let isQuiting: boolean = false

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

  // const devServerURL = createURLRoute(process.env['ELECTRON_RENDERER_URL']!, id)
  // const fileRoute = createFileRoute(
  //   join(__dirname, '../renderer/index.html'),
  //   id
  // )
  // is.dev
  // ? mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!)
  // : mainWindow.loadFile(...fileRoute)
  mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!);

  // mainWindow.on('minimize', function (event) {
  //   event.preventDefault();
  //   mainWindow.hide();
  // });

  // mainWindow.on('close', function (event) {
  //   if (!isQuiting) {
  //     event.preventDefault();
  //     mainWindow.hide();
  //   }
  //   return false;
  // });
};

app.whenReady().then( () => {
  electronApp.setAppUserModelId('com.mbjpay');
  createWindow();
  dbCreate();
  createPath();

  // Configuração do auto launch
  // let electronAutoLauncher = new AutoLaunch({
  //   name: 'MBJPay',
  //   path: app.getPath('exe'),
  // });

  // Verifica se já está configurado para auto launch
  // electronAutoLauncher.isEnabled()
  // .then((isEnabled) => {
  //   if (!isEnabled) {
  //     electronAutoLauncher.enable();
  //   }
  // })
  // .catch((err) => {
  //   console.error(err);
  // });

  // const iconPath = join(__dirname,'../assets', 'icon.png'); // Caminho do ícone

  // tray = new Tray(iconPath);
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Mostrar Aplicação',
  //     click: function () {
  //       mainWindow.show();
  //     },
  //   },
  //   {
  //     label: 'Sair',
  //     click: function () {
  //       isQuiting = true;
  //       app.quit();
  //     },
  //   },
  // ]);

  // tray.setToolTip('MBJ-Pay');
  // tray.setContextMenu(contextMenu);

  // tray.on('double-click', () => {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  // });

  // app.on('browser-window-created', (_, window) => {
  //   optimizer.watchWindowShortcuts(window);
  // });

  watchFileAndFormat( async (formatData) => {
    if(!formatData)
      mainWindow.webContents.send('file', null);

    const db = await dbReadActiveAlias()
    const client = await dbRead('client')
    const mediator = await dbRead('mediator')

    let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
    mainWindow.show();
    let response = await createInstantPayment(formatData, token, client.AccountId, db.Alias, mediator.MediatorAccountId, mediator.MediatorFee)
    

    mainWindow.webContents.send('file', response);
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
  let token = await tokenGenerator()

  mainWindow.webContents.send('access_token', token)
});

ipcMain.on('create_account', async(_, args) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  let newAccount = await createAccount(args, token)
  let data = {
    AccId: newAccount.data.account.accountId,
    AccHID: newAccount.data.accountHolderId,
    Status: newAccount.data.accountStatus,
    Cnpj: args.companyDocument,
    Tel: args.companyPhoneNumber
  }

  await dbInsertClient(data)
});

ipcMain.on('verify_account', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  let consulta = await VerifyAccount(token, db.AccountId)

  let data = {
    AccId: consulta.account.accountId,
    Acc:consulta.account.account,
    Branch:consulta.account.branch,
    Status: consulta.accountStatus,
    MedAccId: consulta.mediatorId 
  }

  if(data.Status !== db.Status)
    await dbUpdateClient(data)
})

ipcMain.on('create_alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')

  let alias = await createAliases(token, db.AccountId)
  if(alias[0] == 202) {
    return 'Aguarde alguns instante...' 
  }
})

ipcMain.on('verify_alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  const verify = await verifyAliases(token, db.AliasId)

  await dbInsertAlias(verify.aliases)

  mainWindow.webContents.send('response_verify_alias', verify.aliases);  
})

ipcMain.on('verify_instantpayment', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  let transactionid = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('transactionid')`).then( (response) => response);
  const db = await dbRead('client')
  const verify = await verifyInstantPayment(transactionid, token, db.AccountId);
  
  mainWindow.webContents.send('response_verify_instantpayment', verify.transactions[0]);
})

ipcMain.on('cancel_payment', async() => {
  removeReqAndCreateRes()
  mainWindow.webContents.send('file', null);
})

ipcMain.on('verify_balance', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const response = await verifyBalance(token);
  
  mainWindow.webContents.send('response_balance', response);
})

ipcMain.on('extract_balance_today', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  const response = await extractBalanceToday(token, db.AccountId);
  mainWindow.webContents.send('response_extract_today', response);
})

ipcMain.on('extract_balance_filter', async(_, args) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  const response = await extractBalanceFilter(token, args[0], args[1], db.AccountId);
  mainWindow.webContents.send('response_extract_filter', response);
})

ipcMain.on('refund_codes', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const response = await refundCodes(token) 

  mainWindow.webContents.send('respose_refund_codes', response.data)
})

ipcMain.on('refund', async(_, args) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  const response = await refundInstantPayment(args[0], args[1], token, db.AccountId) 
  console.log(response)
  // mainWindow.webContents.send('respose_refund', response.data)
})
