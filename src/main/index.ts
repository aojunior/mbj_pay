import { app, BrowserWindow,  ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, removeReqAndCreateRes, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount, VerifyAccount, createAliases, verifyAliases, createInstantPayment, verifyInstantPayment, verifyBalance, extractBalanceToday, extractBalanceFilter, refundInstantPayment, refundCodes, deleteAliases } from '@shared/api'
import { dbClientExists, dbCreate, dbDeleteAlias, dbInsertAlias, dbInsertClient, dbRead, dbReadActiveAlias, dbReadAliases, dbUpdateAlias, dbUpdateClient } from '@shared/database'
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

ipcMain.handle('check-client', async() => {
  const exists = await dbClientExists()
  return exists
})

ipcMain.on('initial_',  async () => {
  const db = await dbRead('client')
  let credential = false
  if(db.AccountId && db.Cnpj)
    credential = true
  mainWindow.webContents.send('_initial', credential)
});

ipcMain.handle('create-account', async(_, clientData) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  let newAccount = await createAccount(clientData, token)
  if(newAccount.error) {
    return 0
  }
  let data = {
    AccId: newAccount.data.account.accountId,
    AccHID: newAccount.data.accountHolderId,
    Status: newAccount.data.accountStatus,
    Cnpj: clientData.companyDocument,
    Tel: clientData.companyPhoneNumber
  }
  let saveClientInDb = await dbInsertClient(data)
  return saveClientInDb
});

ipcMain.handle('get-account', async() => {
  const db = await dbRead('client')
  return db
})

ipcMain.handle('verify-account', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const db = await dbRead('client')
  let consulta = await VerifyAccount(token, db.AccountId)
  if(consulta.error) 
    return 'Error'
  let data = {
    AccId: consulta.account.accountId,
    Acc:consulta.account.account,
    Branch:consulta.account.branch,
    Status: consulta.accountStatus,
    MedAccId: consulta.mediatorId 
  }

  if(data.Status !== db.Status) {
    let update = await dbUpdateClient(data)
    return update
  }
})

ipcMain.handle('create-alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const client = await dbRead('client')
  let createAlias = await createAliases(token, client.AccountId)
  
  console.log(createAlias) 
  return createAlias
})

ipcMain.handle('delete-alias', async(_, alias) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
  const client = await dbRead('client')
  let deleteAlias = await deleteAliases(token, client.AccountId, alias)
  let deleteA
  async function deleteBD() {
    deleteA = await dbDeleteAlias(alias, client.AccountId)
  }

  if(deleteAlias == 202) {
    deleteBD()
    return deleteA
  } else {
    return 'error'
  }
})

ipcMain.handle('update-alias', async() => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then((response) => response);
  const client = await dbRead('client')
  const aliases = await dbReadAliases()
  let verify = await verifyAliases(token, client.AccountId)
  let update
  if(aliases.length < verify.aliases.length) {
    const filteredArray = verify.aliases.filter(item2 => {
      const matchingItem = aliases.find(item1 => item1.Alias === item2.name)
      return !matchingItem
    })
    update = await dbInsertAlias(filteredArray, client.AccountId)
  } else {
    const filteredArray = verify.aliases.filter(item2 => {
      const matchingItem = aliases.find(item1 => item1.Alias === item2.name);
      return matchingItem
    })
    console.log(aliases, verify.aliases)
    // update = await dbUpdateAlias(filteredArray, client.AccountId)
  }

  console.log(aliases, verify.aliases)
  return update
})

ipcMain.handle('verify-alias', async() => {
  const aliases = await dbReadAliases()
  return aliases
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


