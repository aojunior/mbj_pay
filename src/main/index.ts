import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, removeReqAndCreateRes, watchFileAndFormat } from './lib'
import {
  tokenGenerator,
  createAccountAPI,
  VerifyAccountAPI,
  createAliasesAPI,
  verifyAliases,
  createInstantPayment,
  verifyInstantPayment,
  verifyBalance,
  extractBalanceToday,
  extractBalanceFilter,
  refundInstantPayment,
  refundCodes,
  deleteAliases,
  DeleteAccountAPI
} from '@shared/api'
// import {
//   dbClientExists,
//   dbCreate,
//   dbDeleteAlias,
//   dbInsertAlias,
//   dbInsertClient,
//   dbRead,
//   dbReadActiveAlias,
//   dbReadAliases,
//   dbUpdateClient
// } from '@shared/database'
import { shell } from 'electron/common'
import AutoLaunch from 'auto-launch'
import { clientExists, createAliasDB, createClientDB, deleteAliasDB, deleteClientDB, getClientDB, readAliasesDB, updateAliasDB, updateClientDB } from '@shared/database/actions'

let mainWindow: BrowserWindow
let tray: Tray
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
    trafficLightPosition: { x: 15, y: 15 },
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      devTools: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!)

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mbjpay')
  createWindow()
  createPath()  // Cria as pastas necessarias para receber e enviar arquivos de leitura
  // dbCreate()

  // Configuração do auto launch (iniciar com windows)
  let electronAutoLauncher = new AutoLaunch({
    name: 'MBJPay',
    path: app.getPath('exe'),
  });

  // Verifica se já está configurado para auto launch
  electronAutoLauncher.isEnabled()
  .then((isEnabled) => {
    if (!isEnabled) {
      electronAutoLauncher.enable();
    }
  })
  .catch((err) => {
    console.error(err);
  });

  const iconPath = join(__dirname,'../assets', 'icon.png'); // Caminho do ícone

  tray = new Tray(iconPath);
  // Menu após minimizacao da janela
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir Aplicação',
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: 'Sair',
      click: function () {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('MBJ-Pay');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Monitora a pasta de recebimento do arquivo, vindo do sistema
  // Formata e envia para criar pagamento
  watchFileAndFormat(async (formatData) => {
    if (!formatData) mainWindow.webContents.send('file', null)

    // const db = await dbReadActiveAlias()
    // const client = await dbRead('client')
    // const mediator = await dbRead('mediator')

    let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
    
    mainWindow.show()

    // let response = await createInstantPayment(
    //   formatData,
    //   token,
    //   client.AccountId,
    //   db.Alias,
    //   mediator.MediatorAccountId,
    //   mediator.MediatorFee
    // )
    // mainWindow.webContents.send('file', response)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Preloader creates

// cross-screen navigation
ipcMain.on('navigate', (_, route) => {
  mainWindow.loadURL(`http://localhost:5173${route}`)
})

ipcMain.handle('token_generator', async () => {
  let token = await tokenGenerator()
  return token
})


// ipcMain.handle('initial_', async () => {
  // const db = await dbRead('client')
//   let credential = await clientExists()
  // if (db.AccountId && db.Cnpj) credential = true
//   return credential
// })

// HANDLE ACCOUNT
ipcMain.handle('create-account', async (_, formData) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  let newAccount = await createAccountAPI(formData, token)
  if (newAccount.error) {
    return 0
  }
  let data = {
    AccId: newAccount.data.account.accountId,
    AccHId: newAccount.data.accountHolderId,
    Status: newAccount.data.accountStatus,
    AccBank: newAccount.data.account,
    BranchBank: newAccount.data.branch,
    Nome: formData.companyName,
    Email: formData.companyEmailAddress,
    Cnpj: formData.companyDocument,
    Tel: formData.companyPhoneNumber,
    Pass: formData.password
  }
  let saveClientInDb = await createClientDB(data)
  console.log(newAccount)
  console.log(saveClientInDb)
  return 1
})

ipcMain.handle('get-account', async () => {
  const db = await getClientDB()
  return db
})

ipcMain.handle('verify-account', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  let consulta = await VerifyAccountAPI(token, db?.accountId)
  if (consulta.error) return 'Error'

  let data = {
    AccId: consulta.account.accountId,
    AccBank: consulta.account.account,
    Branch: consulta.account.branch,
    Status: consulta.accountStatus,
    MedAccId: consulta.mediatorId
  }
  console.log(consulta)
  if (data.Status !== db?.status) {
    let update = await updateClientDB(data)
    return update
  } else {
    return 'RELOADED'
  }
})

ipcMain.handle('delete-account', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const db = await getClientDB()
  let consulta = await DeleteAccountAPI(token, String(db?.accountId))
  console.log(consulta)
  if(consulta.error) return 'Error'
  const deletionConfirmed = await deleteClientDB(String(db?.accountId))
  return deletionConfirmed
})
// ----------------------------------------------------------------

// HANDLE ALIASES
ipcMain.handle('create-alias', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const aliases = await readAliasesDB()
  const createAlias = await createAliasesAPI(token, String(db?.accountId))  

  if(createAlias.alias.status === 'CLEARING_REGISTRATION_PENDING') {
    setTimeout(async () => {
      // Get all, filter and add new alias in the db
      const verify = await verifyAliases(token, String(db?.accountId))
      const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name);
        return !matchingItem;
      });
      filteredArrayAdd.map(async (alias) => {
        await createAliasDB(alias, String(db?.accountId))
      })

// Filtra aliases que precisam ser atualizados
const filteredArrayUpdate = verify.aliases.filter((aliasAPI) => {
  const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name);
  return matchingItem && matchingItem.status !== aliasAPI.status; // Exemplo de condição para atualização
});

// Filtra aliases que precisam ser removidos
const filteredArrayDelete = aliases.filter((aliasDB) => {
  const matchingItem = verify.aliases.find((aliasAPI) => aliasAPI.name === aliasDB.alias);
  return !matchingItem;
});


    }, 1500)
    return 'CREATED'
  } else {
    console.log(createAlias)
    return 'ERROR'
  }
})

ipcMain.handle('update-alias', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const client = await getClientDB()
  const aliases = await readAliasesDB()
  let verify = await verifyAliases(token, String(client?.accountId))
  let update
  const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
    const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name);
    return !matchingItem;
  });
  filteredArrayAdd.map(async (alias) => {
    await createAliasDB(alias, String(client?.accountId))
  })

  const filteredArrayUpdate = verify.aliases.filter((aliasAPI) => {
    const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name);
    return matchingItem && matchingItem.status !== aliasAPI.status; // Exemplo de condição para atualização
  });

  if(filteredArrayUpdate.length > 0) {
    filteredArrayUpdate.map(async (alias) => {
      await updateAliasDB(alias, String(client?.accountId))
    })
  }

  const filteredArrayDelete = aliases.filter((aliasDB) => {
    const matchingItem = verify.aliases.find((aliasAPI) => aliasAPI.name === aliasDB.alias);
    return !matchingItem;
  });
  if(filteredArrayDelete.length > 0) {
    filteredArrayDelete.map(async (alias) => {
      await deleteAliasDB(alias.alias, String(client?.accountId))
    })
  }

  return update
})

ipcMain.handle('verify-alias', async () => {
  const aliases = await readAliasesDB()
  return aliases
})

ipcMain.handle('delete-alias', async (_, alias) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const client = await getClientDB()
  let deleteAlias = await deleteAliases(token, String(client?.accountId), alias)

  async function deleteBD() {
    const deleteA = await deleteAliasDB(alias, String(client?.accountId))
    return deleteA
  }

  if (deleteAlias == 202) {
    return deleteBD()
  } else {
    return 'ERROR'
  }
})
// ----------------------------------------------------------------

// HANDLE INSTANT PAYMENT
ipcMain.on('verify_instantpayment', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  let transactionid = await mainWindow.webContents
    .executeJavaScript(`localStorage.getItem('transactionid')`)
    .then((response) => response)
  const db = await getClientDB()
  const verify = await verifyInstantPayment(transactionid, token, String(db?.accountId))

  mainWindow.webContents.send('response_verify_instantpayment', verify.transactions[0])
})

ipcMain.on('cancel_payment', async () => {
  removeReqAndCreateRes()
  mainWindow.webContents.send('file', null)
})
// ----------------------------------------------------------------

// HANDLE BALANCE
ipcMain.on('verify_balance', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const response = await verifyBalance(token)

  mainWindow.webContents.send('response_balance', response)
})

ipcMain.on('extract_balance_today', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const response = await extractBalanceToday(token, String(db?.accountId))
  mainWindow.webContents.send('response_extract_today', response)
})

ipcMain.on('extract_balance_filter', async (_, args) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const response = await extractBalanceFilter(token, args[0], args[1], String(db?.accountId))
  mainWindow.webContents.send('response_extract_filter', response)
})
// ----------------------------------------------------------------

ipcMain.on('refund_codes', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const response = await refundCodes(token)

  mainWindow.webContents.send('respose_refund_codes', response.data)
})

ipcMain.on('refund', async (_, args) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const response = await refundInstantPayment(args[0], args[1], token, String(db?.accountId))
  console.log(response)
  // mainWindow.webContents.send('respose_refund', response.data)
})
