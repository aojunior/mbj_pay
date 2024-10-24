const dotenv = require('dotenv');
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
  refundInstantPayment,
  refundCodes,
  verifyRecipientAlias,
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
  getSecureDeviceDB,
  getTransanctionDB,
  registerDeviceDB,
  setDataToTermsOfServiceDB,
  signInDB,
  updatefavoriteRecipientDB,
  updateTransanctionDB
} from '../shared/database/actions'
import { HashComparator } from '@shared/utils'
import { prisma } from '@shared/database/databaseConnect'
import url from 'node:url'
import { create_alias, registerSecureDevice, getInformationsFromMachine, verify_account, verifyAndUpdateAliases } from './lib/IPC_actions'
import { logger } from '@shared/logger';
import { 
  cashOutAPIV1,
  consultingDestinationV1,
  createAccountAPIV1,
  createInstantPaymentAPIV1,
  decodePaymentV1,
  DeleteAccountAPIV1,
  deleteAliasesAPIV1,
  extractBalanceFilterV1,
  extractBalanceTodayV1,
  fakePaymentAPIV1,
  getPspListAPIV1,
  sendEmailAPIV1,
  tokenGeneratorAPIV1,
  verifyBalanceV1,
  verifyCodeAPIV1
} from '@shared/apiV1'
import { handleMessageError } from '@shared/handleErrors';

let mainWindow: BrowserWindow
let tray: Tray
let isQuiting: boolean = false

dotenv.config({ path: path.resolve(__dirname, '.env') });

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
        let result = await createInstantPaymentAPIV1(
          formatData,
          token,
          String(client?.accountId),
          String(db[0]?.alias),
          Number(mediator?.mediatorFee)
        )
        mainWindow.show()

        if(result.message === 'success') {
          const file = {
            accId: client?.accountId,
            status: result.data.financialStatement.status,
            transactionId: result.data.transactionId,
            transactionType: result.data.transactionType,
            totalAmount: result.data.totalAmount,
            description: formatData.recipientComment,
            identify: formatData.orderID
          }
          await createTransanctionDB(file)
        } else {
          return handleMessageError(result.message)
        }
        mainWindow.webContents.send('watch_file', result.data);
      }
    } catch (error) {
      console.log(error)
    }
  })


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
  if(token?.message !== 'success') {
    handleMessageError(token)
  }
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
      let result = await createClientDB(data).then(e => {
        logger.info('save new account on database')
        return {data: e, message: 'SUCCESS'}
      }).catch(err => {
        logger.error(err)
        return {data: null, message: 'ERROR on creating new account'}
      })
      await setDataToTermsOfServiceDB(infos)
      return result
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
  const result = await getClientDB(account.accountId)
  return result
})

ipcMain.handle('verify_account', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const alias = await getAliasesDB(account.accountId)
  const result = await verify_account(token, account.accountId)
  if(alias.length = 0) {
    await create_alias(token, account.accountId)
  }
  return result
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
    let consulta = await DeleteAccountAPIV1(token, account.accountId)
    if(consulta?.message == 'success') {
      logger.info('Deleting account successfully')
      return await verify_account(token, account.accountId)
    } else {
      return handleMessageError(consulta)
    }
  } else {
    return {message: 'alias_registered', data: null}
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
  const result = await create_alias(token, account.accountId)
  return result
})

ipcMain.handle('update-alias', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result =  await verifyAndUpdateAliases(token, account.accountId)
  return result
})

ipcMain.handle('get_alias', async () => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await getAliasesDB(account.accountId)
  return result
})

ipcMain.handle('delete-alias', async (_, alias) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  let result = await deleteAliasesAPIV1(token, account.accountId, alias)
  if (result?.data == 202) {
    await deleteAliasDB(alias, account.accountId)
    return {data: await getAliasesDB(account.accountId), message: 'deleted alias'}
  } else {
    return handleMessageError(result?.message)    
  }
})
// ----------------------------------------------------------------

// HANDLE INSTANT PAYMENT
ipcMain.handle('create_payment_file', async (_, data) => {
  const result = await createReqFile(data)
  return result
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
  const result = await updateTransanctionDB(file)
  return result
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

// HANDLE TESTING PAYMENT
ipcMain.handle('decoding', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const {qrCode, datePayment} = data

  const result = await decodePaymentV1(qrCode, datePayment, token)
  return result
})

ipcMain.handle('verify_destination', async (_, accountDest) => {
  let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  let data = {
    accountId: account.accountId,
    alias: accountDest.value
  }
 
  // if(account.accountId == '27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C') {
  //   data['accountId'] = '86F5EBC4-8807-6034-171C-8D2BD9D0B674'
  //   data['alias'] = '259fb239-34f4-4c17-8187-8efa3910351c'
  // } else {
  //   data['accountId'] = '27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C'
  //   data['alias'] = '3da3f68b-fb91-42e9-9f0c-da87aa8a7881'
  // }

  const result = await consultingDestinationV1(data, token)
  if(result?.message !== 'success') {
    return handleMessageError(result)
  }
  return result
})

ipcMain.handle('fake_payment', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  let acc = {}
  if(account.accountId == '27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C') {
    acc['accountId']  = '86F5EBC4-8807-6034-171C-8D2BD9D0B674'
    acc['accountRecipient'] = '316849'
    acc['branch'] = '427'
  } else {
    acc['accountId']  = '27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C'
    acc['accountRecipient'] = '441414'
    acc['branchRecipient'] = '427'
  }

  const result = await fakePaymentAPIV1(data, acc, token)
  
  return result
})

// ----------------------------------------------------------------

// HANDLE CASH OUT
ipcMain.handle('cash_out', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  let mediator = await getMediatorDB(account.accountId)

  let file = {
    medFee: mediator?.mediatorFee,
    accountId: account.accountId,
    data,
    token
  }
  const result = await cashOutAPIV1(file, token)
  if(result?.message !== 'success') {
    return handleMessageError(result)
  }
  let dataTransaction = {
    accId: account.accountId,
    transactionId: result.data.transactionId,
    transactionType: 'CASH_OUT',
    totalAmount: data.totalAmount,
    transactionDescription: data.msgInfo,
    status: result.data.status
  }
  await createTransanctionDB(dataTransaction)
  return result
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
  const result = await verifyBalanceV1(token, account.accountId)
  if(result.message !== 'success') {
    return handleMessageError(result.message)
  } else {
    return result
  }
})

ipcMain.handle('extract_balance_today', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await extractBalanceTodayV1(token, account.accountId)

  if(result.message !== 'success') {
    return handleMessageError(result.message)
  } else {
    return result
  }
})

ipcMain.handle('extract_balance_filter', async (_, args) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await extractBalanceFilterV1(token, args[0], args[1], account.accountId)
  if(result.message == 'success') {
    return result
  } else {
    return handleMessageError(result)
  }
})
// ----------------------------------------------------------------

// HANDLER REFUND
ipcMain.handle('refund_codes', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const result = await refundCodes(token)

  return result.data.returnCodes
})

ipcMain.handle('refund', async (_, args) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const mediator = await getMediatorDB(account.accountId)
  const result = await refundInstantPayment(args[0], args[1], token, account.accountId, Number(mediator?.mediatorFee))
  return result
})
// ----------------------------------------------------------------

// HANDLER RECIPIENT ALIAS
ipcMain.handle('create_favorite_recipient', async (_, data) => {
  const result = await createfavoriteRecipientDB(data)
  return result
})

ipcMain.handle('update_favorite_recipient', async (_, data) => {
  const result = await updatefavoriteRecipientDB(data)
  return result
})

ipcMain.handle('verify_recipientAlias', async (_, data) => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const result = await verifyRecipientAlias(data, token)

  return result
})

ipcMain.handle('get_favorite_recipients', async () => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await getFavoriteRecipientDB(account.accountId)
  return result
})

ipcMain.handle('get_favorite_recipient_on_id', async (_, data) => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await getFavoriteRecipientOnIdDB(data, account.accountId)
  return result
})

ipcMain.handle('delete_favorite_recipient', async (_, id) => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await deleteFavoriteRecipientDB(id, account.accountId)
  return result
})
// ----------------------------------------------------------------

// UTILITY CONNECTION
ipcMain.handle('security', async (_, password) => {
  let parse = await mainWindow.webContents
  .executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const response = await credentialsDB(account.accountId)
  const result = await HashComparator(password, response)
  return result
})

ipcMain.handle('alter_password', async (_, passData) => {
  let parse = await mainWindow.webContents
  .executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await alterPasswordDB(passData, account.accountId)
  return result
})

ipcMain.handle('signIn', async (_, formData) => {
  try {
    const data = await signInDB(formData.taxId)
    if(!data) return {data: null, message: 'Por favor verifique as credenciais e tente novamente.'}
    let passHash = {
      saltKey: data?.saltKey,
      hashPassword: data?.hashPassword
    }
    const verifyPassword = await HashComparator(formData.password, passHash)
    if(verifyPassword) {
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

ipcMain.handle('send_email', async () => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await sendEmailAPIV1(account.accountId, account.email)
  return result
})

ipcMain.handle('verify_token', async (_, code) => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const result = await verifyCodeAPIV1(account.accountId, code)
  return result
})

ipcMain.handle('register_device', async() => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const device = await registerSecureDevice()
  const data = {
    accountId: account.accountId,
    type: device.type,
    deviceId: device.deviceId,
    deviceName: device.deviceName,
  }
  const result = await registerDeviceDB(data)
  return result
})

ipcMain.handle('get_register_device', async() => {
  let parse = await mainWindow.webContents.executeJavaScript(`localStorage.getItem('account')`)
  .then((response) => response)
  let account = JSON.parse(parse)
  const device = await registerSecureDevice()
  const result = await getSecureDeviceDB(account.accountId)
  return {device, result}
})

ipcMain.handle('psp_list', async () => {
  let token = await mainWindow.webContents
  .executeJavaScript(`sessionStorage.getItem('token')`)
  .then((response) => response)
  const result = await getPspListAPIV1(token)
  return result
})

ipcMain.on('logger', async (_, data) => {
  data.type == 'info' && logger.info(data.msg)
  data.type == 'error' && logger.error(data.msg)
  data.type == 'warn' && logger.warn(data.msg)
})

ipcMain.on('check-for-updates', async () => {
  // autoUpdater.checkForUpdates();
  autoUpdater.checkForUpdatesAndNotify();

});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
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