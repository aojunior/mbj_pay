import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import  path, { join } from 'path'
import os from 'node:os'
import { machineIdSync } from 'node-machine-id'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { createPath, removeReqFile, createResFile, watchFileAndFormat, encriptoFile, readEncriptoFile } from './lib'
import {
  tokenGenerator,
  createAccountAPI,
  VerifyAccountAPI,
  createAliasesAPI,
  verifyAliases,
  verifyInstantPayment,
  verifyBalance,
  extractBalanceToday,
  extractBalanceFilter,
  refundInstantPayment,
  refundCodes,
  deleteAliases,
  // DeleteAccountAPI,
  getLocationAndIPV6,
  createInstantPayment,
  DeleteAccountAPI
} from '../shared/api'
import { shell } from 'electron/common'
import AutoLaunch from 'auto-launch'
import {
  alterPasswordDB,
  createAliasDB,
  createClientDB,
  credentialsDB,
  deleteAliasDB,
  deleteClientDB,
  getAliasesDB,
  // deleteClientDB,
  getClientDB,
  getMediatorDB,
  insertExistingClientDB,
  setDataToTermsOfService,
  updateAliasDB,
  updateClientDB
} from '../shared/database/actions'
import { currentTime, HashComparator } from '@shared/utils'
import { prisma } from '@shared/database/databaseConnect'
import url from 'node:url'

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
  const isDev = process.env.NODE_ENV === 'development';
  // const indexPath = isDev
  // ? path.join(__dirname, '../renderer/index.html')  // Em desenvolvimento
  // : `file://${path.join(app.getAppPath(), 'renderer/index.html')}`; // Em produção

  // mainWindow.loadURL(indexPath);
  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!);
  //   mainWindow.webContents.openDevTools(); // Abre as DevTools para debugar
  // } else {
  //   mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  // }

  if (isDev) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']!);
    mainWindow.webContents.openDevTools();
  } else {
    // Carrega o arquivo HTML de produção
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
  createPath() // Cria as pastas necessarias para receber e enviar arquivos de leitura
  removeReqFile()

  // Usado apenas para criar arquivo de conta com status Regular
  // encriptoTest({Cnpj:'14787479000162', Pass:'12345', Account:"27773DE5-E17D-4C8B-9EF4-AD4741BF9E0C"})

  // Configuração do auto launch (iniciar com windows)
  let electronAutoLauncher = new AutoLaunch({
    name: 'MBJPay',
    path: app.getPath('exe')
  })

  // Verifica se já está configurado para auto launch
  electronAutoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        electronAutoLauncher.enable()
      }
    })
    .catch((err) => {
      console.error(err)
    })

  const iconPath = join(__dirname, '../assets', 'icon.png') // Caminho do ícone

  tray = new Tray(iconPath)
  // Menu após minimizacao da janela
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
  // Formata e envia para criar pagamento
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
          mediator?.mediatorAccountId,
          mediator?.mediatorFee
        )

        mainWindow.show()
        mainWindow.webContents.send('watch_file', response);
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
    // queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
    
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

const extraResourcesPath = app.getAppPath().replace('app.asar', ''); // impacted by extraResources setting in electron-builder.yml
const platformName = getPlatformName();

const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
);
// const qePath = path.join(
//   extraResourcesPath,
//   platformToExecutables[platformName].queryEngine
// );

// process.env.PRISMA_QUERY_ENGINE_BINARY = qePath

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
// cross-screen navigation
ipcMain.on('navigate', (_, route) => {
  mainWindow.loadURL(`http://localhost:5173${route}`)
})

ipcMain.handle('reload-app', () => {
  const window = BrowserWindow.getAllWindows()[0];
  window.reload(); // Recarrega a aplicação
});

ipcMain.handle('accept_terms_of_service', async () => {
  const fetch = await getLocationAndIPV6()
  function getIPs() {
    let ifaces: any = os.networkInterfaces()
    let ipAdresse: any = {}
    Object.keys(ifaces).forEach(function (ifname) {
      let alias = 0
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          // console.log(ifname + ':' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          // console.log(ifname, iface.address);
          ipAdresse = { IP: iface.address, MAC: iface.mac }
        }
        ++alias
      })
    })
    return ipAdresse.IP
  }
  let ipNet = getIPs()
  let idDevice = machineIdSync(true)

  const infos = {
    time: currentTime,
    createdAT: new Date(),
    latitude: fetch.latitude,
    longitude: fetch.longitude,
    city: fetch.city,
    state: fetch.region_name,
    contry: fetch.country_name,
    // ipv6: fetch.ip,
    ip: ipNet,
    idDevice: idDevice
  }
  const saveInDB = await setDataToTermsOfService(infos)
  return saveInDB
})

ipcMain.handle('token_generator', async () => {
  let token = await tokenGenerator()
  return token
})

// HANDLE ACCOUNT
ipcMain.handle('create_account', async (_, formData) => {
  try {
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
    let fileEncript = {Cnpj: data.Cnpj, Pass: data.Pass, Account: data.AccId}
    await encriptoFile(fileEncript)
    let saveClientInDb = await createClientDB(data)
    console.log(saveClientInDb)
    return 1
  } catch (error) {
    console.error('Error creating account:', error);
    return { status: 'error', message: 'Failed to create account.' };
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
  let consulta = await VerifyAccountAPI(token, db?.accountId)
  if (consulta.error) return 'Error'

  let data = {
    AccId: consulta.account.accountId,
    AccBank: consulta.account.account,
    Branch: consulta.account.branch,
    Status: consulta.accountStatus,
    MedAccId: consulta.mediatorId
  }
  if (data.Status !== db?.status) {
    let update = await updateClientDB(data)
    return update
  } else {
    return 'RELOADED'
  }
})

ipcMain.handle('delete_account', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const alias = await getAliasesDB()
  console.log(alias)
  if (alias.length == 0) {
    const db = await getClientDB()
    let consulta = await DeleteAccountAPI(token, String(db?.accountId))
    console.log(consulta)
    if (consulta.error) return 'Error'
    const deletionConfirmed = await deleteClientDB(String(db?.accountId))
    return deletionConfirmed
  } else {
    return 'Alias Registered'
  }
})

// ----------------------------------------------------------------

// HANDLE ALIASES
ipcMain.handle('create-alias', async () => {
  let token = await mainWindow.webContents
    .executeJavaScript(`sessionStorage.getItem('token')`)
    .then((response) => response)
  const db = await getClientDB()
  const createAlias = await createAliasesAPI(token, String(db?.accountId))
  console.log('createAlias', createAlias)
  if (createAlias.alias.status === 'CLEARING_REGISTRATION_PENDING') {
    setTimeout(async () => {
      const aliases = await getAliasesDB()
      // Get all, filter and add new alias in the db
      const verify = await verifyAliases(token, String(db?.accountId))
      const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
        const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
        return !matchingItem
      })
      filteredArrayAdd.map(async (alias) => {
        await createAliasDB(alias, String(db?.accountId))
      })
      console.log('filteredArrayAdd1 ', filteredArrayAdd)
    }, 3000)
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
  const aliases = await getAliasesDB()
  let verify = await verifyAliases(token, String(client?.accountId))

  const filteredArrayAdd = verify.aliases.filter((aliasAPI) => {
    const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
    return !matchingItem
  })
  if (filteredArrayAdd.length > 0) {
    filteredArrayAdd.map(async (alias) => {
      await createAliasDB(alias, String(client?.accountId))
    })
  }

  const filteredArrayUpdate = verify.aliases.filter((aliasAPI) => {
    const matchingItem = aliases.find((aliasDB) => aliasDB.alias === aliasAPI.name)
    return matchingItem && matchingItem.status !== aliasAPI.status
  })

  if (filteredArrayUpdate.length > 0) {
    filteredArrayUpdate.map(async (alias) => {
      await updateAliasDB(alias)
    })
  }

  const filteredArrayDelete = aliases.filter((aliasDB) => {
    const matchingItem = verify.aliases.find((aliasAPI) => aliasAPI.name === aliasDB.alias)
    return !matchingItem
  })

  if (filteredArrayDelete.length > 0) {
    filteredArrayDelete.map(async (alias) => {
      await deleteAliasDB(alias.alias, String(client?.accountId))
    })
  }
  console.log('filteredArrayAdd ', filteredArrayAdd)
  console.log('filteredArrayUpdate ', filteredArrayUpdate)
  console.log('filteredArrayDelete ', filteredArrayDelete)
})

ipcMain.handle('verify-alias', async () => {
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

  return verify.transactions[0]
})

ipcMain.on('cancel_payment', async () => {
  removeReqFile()
  createResFile()
  mainWindow.webContents.send('file', null)
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
      if (consulta.error) return 'Error'

      let data = {
        AccHId: consulta.accountHolderId,
        AccId: consulta.account.accountId,
        AccBank: 0,
        Branch: 0,
        Name: consulta.additionalDetailsCorporate.companyName,
        Email: consulta.client.email,
        TaxId: consulta.client.taxIdentifier.taxId,
        Phone: consulta.client.mobilePhone.phoneNumber,
        Status: consulta.accountStatus,
        Key: result.saltKey,
        Pass: result.hashPassword
      }
      if(consulta.account.branch) {
        data.AccBank = consulta.account.account
        data.Branch = consulta.account.branch
      }
      let update = await insertExistingClientDB(data)

      const fetch = await getLocationAndIPV6()
      function getIPs() {
        let ifaces: any = os.networkInterfaces()
        let ipAdresse: any = {}
        Object.keys(ifaces).forEach(function (ifname) {
          let alias = 0
          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return
            }
    
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              // console.log(ifname + ':' + alias, iface.address);
            } else {
              // this interface has only one ipv4 adress
              // console.log(ifname, iface.address);
              ipAdresse = { IP: iface.address, MAC: iface.mac }
            }
            ++alias
          })
        })
        return ipAdresse.IP
      }
      let ipNet = getIPs()
      let idDevice = machineIdSync(true)
      const infos = {
        time: currentTime,
        createdAT: new Date(),
        latitude: fetch.latitude,
        longitude: fetch.longitude,
        city: fetch.city,
        state: fetch.region_name,
        contry: fetch.country_name,
        // ipv6: fetch.ip,
        ip: ipNet,
        idDevice: idDevice
      }
      await setDataToTermsOfService(infos)

      return update
    }
  } catch(error) {
    console.log(error)
  }
})