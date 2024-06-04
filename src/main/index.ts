import { app, BrowserWindow,  ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, watchFileAndFormat  } from './lib'
import { tokenGenerator, createAccount, VerifyAccount, createAliases, verifyAliases, createInstantPayment } from '@shared/api'
import { dbAlter, dbInsert } from '@shared/database'
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
};

app.whenReady().then( () => {
  electronApp.setAppUserModelId('com.mbjpay');
  createWindow();
  createPath();

  // Configuração do auto launch
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
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar Aplicação',
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

  watchFileAndFormat( async (formatData) => {
    let token = await mainWindow.webContents.executeJavaScript(`sessionStorage.getItem('token')`).then( (response) => response);
    mainWindow.show();
    let response = await createInstantPayment(formatData, token)
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