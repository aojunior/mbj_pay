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
  removeResFile,
  createReqFile
} from './lib'
import {
  verifyInstantPayment,
  verifyBalance,
  extractBalanceToday,
  extractBalanceFilter,
  refundInstantPayment,
  refundCodes,
  deleteAliases,
  createInstantPayment,
  DeleteAccountAPI,
  verifyRecipientAlias,
  decodeQRCodeAPI,
  createAccountAPI,
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
  getClientDB2,
  getFavoriteRecipientDB,
  getFavoriteRecipientOnIdDB,
  getMediatorDB,
  getTransanctionDB,
  setDataToTermsOfServiceDB,
  signInDB,
  updatefavoriteRecipientDB,
  updateTransanctionDB
} from '../shared/database/actions'
import { HashComparator } from '@shared/utils'
import { prisma } from '@shared/database/databaseConnect'
import url from 'node:url'
import { create_alias, getInformationsFromMachine, verify_account, verifyAndUpdateAliases } from './lib/IPC_actions'
import { logger } from '@shared/logger';
import { createAccountAPIV1, createInstantPaymentV1, deleteAliasesV1, getPspListAPIV1, tokenGeneratorAPIV1 } from '@shared/apiV1';
import { handleMessageError } from '@shared/handleErrors';

let mainWindow: BrowserWindow
let tray: Tray
let isQuiting: boolean = false

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'aojunior',
  repo: 'mbj_pay',
  token: process.env.MAIN_VITE_GH_TOKEN
});

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
      let token = await mainWindow.webContents
      .executeJavaScript(`sessionStorage.getItem('token')`)
      .then((response) => response)

      let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
      .then((response) => response)
      let account = JSON.parse(parse)

      if (!formatData) {
        return {
          error: 'Arquivo não encontrado no diretório de recebimento.',
          success: false
        }
      } else {
        if(account.status !== 'REGULAR') {
          mainWindow.webContents.send('watch_file', {
            error: 'Não é possível gerar venda!',
            success: false
          });
          return 
        }
        const db = await getAliasesDB(account.accountId)
        const client = await getClientDB(account.accountId)
        const mediator = await getMediatorDB(account.accountId)
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
        } else {
          handleMessageError(response.message)
        }
        mainWindow.webContents.send('watch_file', response.data);
      }
    } catch (error) {
      console.log(error)
    }
  })

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    mainWindow?.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
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
  let token = await tokenGeneratorAPIV1()
  return token
})

ipcMain.handle('accept_terms_of_service', async () => {
  let data = await getInformationsFromMachine()
  return data
})

// HANDLE ACCOUNT
ipcMain.handle('create_account', async (_, formData) => {
  try {
    let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
    let infos = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('informations')`)
    .then((response) => JSON.parse(response))

    formData.idDevice = infos?.idDevice
    formData.city = infos?.city
    formData.country = infos?.country
    formData.zipCode = infos?.zipCode
    formData.state = infos?.state
    formData.latitude = infos?.latitude
    formData.longitude = infos?.longitude
    formData.ip = infos?.ip
 
    let newAccount = await createAccountAPIV1(formData, token)
    
    if(newAccount?.message !== 'success') {
      let error = newAccount
      logger.error(error?.message)
      return handleMessageError(error?.message)
    } else {
      logger.info('Created a new account')
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
      infos.accountId = newAccount?.data.account.accountId
      let saveClientInDb = await createClientDB(data).then(e => {
        logger.info('save new account on database')
        return {data: e, message: 'SUCCESS'}
      }).catch(err => {
        logger.error(err)
        return {data: null, message: 'ERROR on creating new account'}
      })
      await setDataToTermsOfServiceDB(infos)
      return saveClientInDb
    }
  } catch (error) {
    logger.error(error)
    return { data: null, message: 'Fatal_ERROR' };
  }
})

ipcMain.handle('get_account', async () => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const db = await getClientDB(account.accountId)
  return db
})

ipcMain.handle('verify_account', async (_, accountId) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const data = await verify_account(token, accountId)
  await create_alias(token, accountId)
  return data
})

ipcMain.handle('delete_account', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const alias = await getAliasesDB(account.accountId)

  if (alias.length == 0) {
    let consulta = await DeleteAccountAPI(token, account.accountId)
    if (consulta.error.code === '97') {
      return 'balance_error'
    }

    if(consulta == 200) {
      return await verify_account(token, account.accountId)
    } else {
      return consulta.error.message
    }
  } else {
    return 'alias_registered'
  }
})
// ----------------------------------------------------------------

// HANDLE ALIASES
ipcMain.handle('create-alias', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const resp = await create_alias(token, account.accountId)
  return resp
})

ipcMain.handle('update-alias', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  return await verifyAndUpdateAliases(token, account.accountId)
})

ipcMain.handle('get_alias', async () => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  
  const aliases = await getAliasesDB(account.accountId)
  return aliases
})

ipcMain.handle('delete-alias', async (_, alias) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  
  let deleteAlias = await deleteAliasesV1(token, account.accountId, alias)
  if (deleteAlias?.data == 202) {
    await deleteAliasDB(alias, account.accountId)
    return {data: await getAliasesDB(account.accountId), message: 'deleted alias'}
  } else {
    return handleMessageError(deleteAlias?.message)    
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
  let parse = await mainWindow.webContents
  .executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)

  let account = JSON.parse(parse)
  const db = await getClientDB(account.accountId)
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


// HANDLE DECODING
ipcMain.handle('decoding', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)

  const {qrCode, datePayment} = data

  const payment = await decodeQRCodeAPI(qrCode, datePayment, token)
  return payment
})
// ----------------------------------------------------------------

// HANDLE BALANCE
ipcMain.handle('verify_balance', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await verifyBalance(token, account.accountId)
  if(response.success !== 'success') {
    return handleMessageError(response.message)
  } else {
    return response
  }
})

ipcMain.handle('extract_balance_today', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await extractBalanceToday(token, String(account.accountId))
  if(response.success !== 'success') {
    return handleMessageError(response.message)
  } else {
    return response
  }
})

ipcMain.handle('extract_balance_filter', async (_, args) => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)

  const db = await getClientDB(account.accountId)
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
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const mediator = await getMediatorDB(account.accountId)
  const response = await refundInstantPayment(args[0], args[1], token, account.accountId, Number(mediator?.mediatorFee))
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
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await getFavoriteRecipientDB(account.accountId)
  return response
})

ipcMain.handle('get_favorite_recipient_on_id', async (_, data) => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await getFavoriteRecipientOnIdDB(data, account.accountId)
  return response
})

ipcMain.handle('delete_favorite_recipient', async (_, id) => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const del = await deleteFavoriteRecipientDB(id, account.accountId)
  return del
})
// ----------------------------------------------------------------

// UTILITY CONNECTION
ipcMain.handle('security', async (_, password) => {
  let parse = await mainWindow.webContents
  .executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await credentialsDB(account.accountId)
  const checkPass = await HashComparator(password, response)
  return checkPass
})

ipcMain.handle('alter_password', async (_, passData) => {
  let parse = await mainWindow.webContents
  .executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const alterPassword = await alterPasswordDB(passData, account.accountId)
  return alterPassword
})

ipcMain.handle('signIn', async (_, formData) => {
  try {
    const data = await signInDB(formData.taxId)
    if(!data) return {data: null, message: 'Por favor verifique as credenciais e tente novamente.'}
    let passHash = {
      saltKey: data?.saltKey,
      hashPassword: data?.hashPassword
    }
    const verifyP = await HashComparator(formData.password, passHash)
    if(verifyP) {
      const client = await getClientDB(data?.accountId)
      logger.info('SignIn successfully')
      return {data: client, message: ''}
    } else {
      return {data: null, message: 'Por favor verifique as credenciais e tente novamente!'}
    }
  } catch(error) {
    logger.error(error)
  }
})

ipcMain.handle('psp_list', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const psp = await getPspListAPIV1(token)
  return psp
})

ipcMain.on('logger', async (_, data) => {
  data.type == 'info' && logger.info(data.message)
  data.type == 'error' && logger.error(data.message)
  data.type == 'warn' && logger.warn(data.message)
})

ipcMain.on('check-for-updates', async () => {
  autoUpdater.checkForUpdates();
});

autoUpdater.on('update-not-available', async () => {

  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('error', async (error) => {

  mainWindow.webContents.send('error', error.message);
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});