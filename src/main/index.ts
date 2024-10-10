import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { autoUpdater } from 'electron-updater';
import  path, { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import {
  createPath,
  removeReqFile,
  createResFile,
  watchFileAndFormat,
  encriptoFile,
  readEncriptoFile,
  removeResFile,
  createReqFile
} from './lib'
import {
  tokenGeneratorAPI,
  createAccountAPI,
  VerifyAccountAPI,
  verifyInstantPayment,
  verifyBalance,
  extractBalanceToday,
  extractBalanceFilter,
  refundInstantPayment,
  refundCodes,
  deleteAliases,
  createInstantPayment,
  DeleteAccountAPI,
  verifyRecipientAlias
} from '../shared/api'
import { shell } from 'electron/common'
import AutoLaunch from 'auto-launch'
import {
  alterPasswordDB,
  createClientDB,
  createfavoriteRecipientDB,
  createTransanctionDB,
  credentialsDB,
  deleteAliasDB,
  deleteFavoriteRecipientDB,
  getAliasesDB,
  getClientDB,
  getFavoriteRecipientDB,
  getFavoriteRecipientOnIdDB,
  getMediatorDB,
  getTransanctionDB,
  insertExistingClientDB,
  updatefavoriteRecipientDB,
  updateTransanctionDB
} from '../shared/database/actions'
import { HashComparator } from '@shared/utils'
import { prisma } from '@shared/database/databaseConnect'
import url from 'node:url'
import { create_alias, createLogs, getInformationsFromMachine, verify_account, verifyAndUpdateAliases } from './lib/IPC_actions'

let mainWindow: BrowserWindow
let tray: Tray
let isQuiting: boolean = false

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 800,
    show: false,
    resizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    center: true,
    title: 'MBJ PAY',
    frame: true,
    trafficLightPosition: { x: 15, y: 15 },
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // devTools: true,
    }
  })
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!);
    mainWindow.setAutoHideMenuBar(true);  
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(false);  
    mainWindow.loadURL(
      url.format(
        {
          pathname: path.join(__dirname, '../renderer/index.html'),
          protocol: 'file:',
          slashes: true
        }
      )
    );
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mbjpay')
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();
  createPath()
  removeReqFile()
  removeResFile()
  // Usado apenas para criar arquivo de conta com status Regular
  // encriptoTest({Cnpj:'14787479000162', Pass:'12345', Account:"27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C"})

  // Configuração do auto launch (iniciar com windows)
  let electronAutoLauncher = new AutoLaunch({
    name: 'MBJPay',
    path: app.getPath('exe')
  })

  
  electronAutoLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) {
      electronAutoLauncher.enable()
    }
  }).catch((err) => {
    createLogs('error', err)
    console.error(err)
  })

  const iconPath = join(__dirname, '../assets', 'icon.png')

  tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir Aplicação',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Sair',
      click: async function () {
        isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('MBJ-Pay')
  tray.setContextMenu(contextMenu)
  
  tray.on('double-click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Monitora a pasta de recebimento do arquivo, vindo do sistema
  watchFileAndFormat(async (formatData) => {
    try {
      if (!formatData) {
        return {
          error: 'Arquivo não encontrado no diretório de recebimento.',
          success: false
        }
      } else {
        const db = await getAliasesDB()
        const client = await getClientDB()
        const mediator = await getMediatorDB()
        if(client?.status === 'ERROR') {
          mainWindow.webContents.send('watch_file', {
            error: 'Não é possível gerar venda!',
            success: false
          });
          return 
        }

        let token = await mainWindow.webContents
        .executeJavaScript(`sessionStorage.getItem('token')`)
        .then((response) => response)

        let response = await createInstantPayment(
          formatData,
          token,
          String(client?.accountId),
          String(db[0]?.alias),
          Number(mediator?.mediatorFee)
        )
        mainWindow.show()

        if(response.message === 'SUCCESS') {
          const file = {
            accId: client?.accountId,
            status: response.data.financialStatement.status,
            transactionId: response.data.transactionId,
            transactionType: response.data.transactionType,
            totalAmount: response.data.totalAmount,
            description: formatData.recipientComment,
            identify: formatData.orderID
          }
          await createTransanctionDB(file)
        }

        mainWindow.show()
        mainWindow.webContents.send('watch_file', response.data);
      }
    } catch (error) {
      console.log(error)
    }
  })

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    createLogs('info', 'Update available');
    mainWindow?.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    createLogs('info', 'download new version');
    mainWindow?.webContents.send('update_downloaded');
  });
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    await prisma.$disconnect();
    app.quit()
  }
})

// Prisma
const platformToExecutables: Record<string, any> = {
  win32: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-windows.exe', 
  },
  linux: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node',
  },
  darwin: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node',
  },
  darwinArm64: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-darwin-arm64',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node',
  },
};

function getPlatformName(): string {
  const isDarwin = process.platform === 'darwin';
  if (isDarwin && process.arch === 'arm64') {
    return `${process.platform}Arm64`;
  }

  return process.platform;
}

const extraResourcesPath = app.getAppPath().replace('app.asar', '');
const platformName = getPlatformName();
const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
);

ipcMain.on('config:get-app-path', (event) => {
  event.returnValue = app.getAppPath();
});

ipcMain.on('config:get-platform-name', (event) => {
  const isDarwin = process.platform === 'darwin';
  event.returnValue =
    isDarwin && process.arch === 'arm64'
      ? `${process.platform}Arm64`
      : (event.returnValue = process.platform);
});

ipcMain.on('config:get-prisma-me-path', (event) => {
  event.returnValue = mePath;
});
// Prisma end 

// IPC Preloader creates
ipcMain.handle('reload-app', () => {
  const window = BrowserWindow.getAllWindows()[0];
  window.reload();
});

ipcMain.handle('token_generator', async () => {
  let token = await tokenGeneratorAPI()
  return token
})

ipcMain.handle('accept_terms_of_service', async () => {
  return await getInformationsFromMachine()
})

// HANDLE ACCOUNT
ipcMain.handle('create_account', async (_, formData) => {
  try {
    let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
    let newAccount = await createAccountAPI(formData, token)
    
    if(newAccount.message !== 'SUCCESS') {
      let error = newAccount.data

      console.log(error.message)
      if (error.response) {
        createLogs('error', error.response.data)
      } else {
        createLogs('error', error.message)
      }
      return newAccount
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
    let fileEncript = {Cnpj: data.Cnpj, Pass: data.Pass, Account: data.AccId}
    await encriptoFile(fileEncript)

    let saveClientInDb = await createClientDB(data).then(e => {
      return {data: e, message: 'SUCCESS'}
    }).catch(err => {
      createLogs('error', err)
      return {data: null, message: 'ERROR'}
    })
    return saveClientInDb
  } catch (error) {
    createLogs('error', 'Error creating account: ' + error)
    return { data: null, message: 'Fatal_ERROR' };
  }
})

ipcMain.handle('get_account', async () => {
  const db = await getClientDB()
  return db
})

ipcMain.handle('verify_account', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const db = await getClientDB()
  const data = await verify_account(token, db)

  await create_alias(token, String(db?.accountId), db?.status)
  return data
})

ipcMain.handle('delete_account', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const alias = await getAliasesDB()

  if (alias.length == 0) {
    const db = await getClientDB()
    let consulta = await DeleteAccountAPI(token, String(db?.accountId))
    if (consulta.error.code === '97') {
      await createLogs('error', 'Existing avalible balances')
      return 'balance_error'
    }

    if(consulta == 200) {
      await createLogs('info', 'Account disabled successfully')
      return await verify_account(token, db)
    } else {
      await createLogs('error', consulta.error.message)
      return consulta.error.message
    }
  } else {
    await createLogs('error', 'Existing active alias')
    return 'alias_registered'
  }
})
// ----------------------------------------------------------------

// HANDLE ALIASES
ipcMain.handle('create-alias', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const db = await getClientDB()
  const resp = await create_alias(token, String(db?.accountId), db?.status)
  return resp
})

ipcMain.handle('update-alias', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  return await verifyAndUpdateAliases(token)
})

ipcMain.handle('get_alias', async () => {
  const aliases = await getAliasesDB()
  return aliases
})

ipcMain.handle('delete-alias', async (_, alias) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const client = await getClientDB()
  let deleteAlias = await deleteAliases(token, String(client?.accountId), alias)

  async function deleteBD() {
    await deleteAliasDB(alias, String(client?.accountId))
  }

  if (deleteAlias == 202) {
    await deleteBD()
    return {data: await getAliasesDB(), message: 'SUCCESS'}
  } else {
    if(deleteAlias == 503) {
      return {data: null, message: 'NETWORK_ERROR'}
    } else {
      return {data: null, message: 'GENERIC_ERROR'}
    }
  }
})
// ----------------------------------------------------------------

// HANDLE INSTANT PAYMENT
ipcMain.handle('create_payment_file', async (_, data) => {
  const payment = await createReqFile(data)
  return payment
})

ipcMain.handle('verify_instantpayment', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  let transactionid = await mainWindow.webContents
    .executeJavaScript(`localStorage.getItem('transactionid')`)
    .then((response) => response)
  const db = await getClientDB()
  const verify = await verifyInstantPayment(transactionid, token, String(db?.accountId))
  await createResFile(verify.transactions[0].transactionStatus)
  return verify.transactions[0]
})

ipcMain.handle('cancel_instantpayment', async (_, data) => {
  await createResFile('CANCELED')
  const transaction = await getTransanctionDB(data.transactionId)
  const file = {
    id: transaction?.id,
    updatedAT: data.transactionDate,
    message: 'OPERACAO CANCELADA PELO USUARIO',
    status: 'CANCELED',
  }
  const update = await updateTransanctionDB(file)
  return update
})

ipcMain.handle('finished_instantpayment', async(_, data) => {
  const transaction = await getTransanctionDB(data.transactionId)
  if(transaction?.status !== 'CANCELED') {
    const file = {
      id: transaction?.id,
      updatedAT: data.transactionDate,
      status: data.transactionStatus
    }
    await updateTransanctionDB(file)
  }
  removeReqFile()
  mainWindow.hide()
})
// ----------------------------------------------------------------

// HANDLE BALANCE
ipcMain.handle('verify_balance', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const response = await verifyBalance(token)
  return response
})

ipcMain.handle('extract_balance_today', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const response = await extractBalanceToday(token, String(db?.accountId))
  return response
})

ipcMain.handle('extract_balance_filter', async (_, args) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const response = await extractBalanceFilter(token, args[0], args[1], String(db?.accountId))
  return response
})
// ----------------------------------------------------------------

// HANDLER REFUND
ipcMain.handle('refund_codes', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const response = await refundCodes(token)

  return response.data.returnCodes
})

ipcMain.handle('refund', async (_, args) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const db = await getClientDB()
  const mediator = await getMediatorDB()
  const response = await refundInstantPayment(args[0], args[1], token, String(db?.accountId), Number(mediator?.mediatorFee))
  return response
})
// ----------------------------------------------------------------

// HANDLER RECIPIENT ALIAS
ipcMain.handle('create_favorite_recipient', async (_, data) => {
  const create = await createfavoriteRecipientDB(data)
  return create
})

ipcMain.handle('update_favorite_recipient', async (_, data) => {
  const create = await updatefavoriteRecipientDB(data)
  return create
})

ipcMain.handle('verify_recipientAlias', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const response = await verifyRecipientAlias(data, token)

  return response
})

ipcMain.handle('get_favorite_recipients', async () => {
  const response = await getFavoriteRecipientDB()
  return response
})

ipcMain.handle('get_favorite_recipient_on_id', async (_, data) => {
  const response = await getFavoriteRecipientOnIdDB(data)
  return response
})

ipcMain.handle('delete_favorite_recipient', async (_, id) => {
  const del = await deleteFavoriteRecipientDB(id)
  return del
})
// ----------------------------------------------------------------

// UTILITY CONNECTION
ipcMain.handle('security', async (_, password) => {
  const response = await credentialsDB()
  const checkPass = await HashComparator(password, response)
  return checkPass
})

ipcMain.handle('alter_password', async (_, passData) => {
  const db = await getClientDB()
  const alterPassword = await alterPasswordDB(passData, db?.accountId)
  return alterPassword
})

ipcMain.handle('signIn', async (_, formData) => {
  try {
    const result = await readEncriptoFile(formData)

    let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)

    if(result) {
      let consulta = await VerifyAccountAPI(token, result.account)
      
      if (!consulta.data) {
        createLogs('error', consulta.message)
        return consulta
      }
      
      let data = {
        AccHId: consulta.data.accountHolderId,
        AccId: consulta.data.account.accountId,
        AccBank: 0,
        Branch: 0,
        Name: consulta.data.additionalDetailsCorporate.companyName,
        Email: consulta.data.client.email,
        TaxId: consulta.data.client.taxIdentifier.taxId,
        Phone: consulta.data.client.mobilePhone.phoneNumber,
        Status: consulta.data.accountStatus,
        MedAccId: consulta.data.mediatorId,
        Key: result.saltKey,
        Pass: result.hashPassword
      }

      if(consulta.data.account.branch) {
        data.AccBank = consulta.data.account.account
        data.Branch = consulta.data.account.branch
      }

      let update = await insertExistingClientDB(data)
      getInformationsFromMachine()
      verifyAndUpdateAliases(token)
      return {data: update, message: ''}
    } else {
      return {data: null, message: 'login_error'}
    }
  } catch(error) {
    console.log(error)
  }
})

ipcMain.on('logs', async(_, data) => {
  await createLogs(data.type, data.message)
})

ipcMain.on('check-for-updates', async () => {
  await createLogs('info','User requested check for updates');
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-not-available', async () => {
  await createLogs('info', 'Nenhuma atualização disponível.');
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('error', async (error) => {
  await createLogs('error', 'Erro ao verificar atualizações:' + error);
  mainWindow.webContents.send('error', error.message);
});

ipcMain.on('restart_app', () => {
  createLogs('info', 'Install new version');
  autoUpdater.quitAndInstall();
});