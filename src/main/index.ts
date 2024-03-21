import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createPath, getRootDirectory,  } from './lib'
import { ensureDirSync, readFile, unwatchFile, watchFile } from 'fs-extra'
import { fileEncoding } from '@shared/constants'

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    fullscreenable: false,
    closable: false,
    center: true,
    title: 'MBJ PAY',
    frame: true,
    trafficLightPosition: {x:15, y:15},
    ...(process.platform === 'linux' ? { icon } : {icon}),
    webPreferences: {
      // preload: join(__dirname, '../preload/index.js'),
      // sandbox: true,
      // contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function watchFileAndFormat(callback:(formatData: any) => void) {
  const rootDir = getRootDirectory();
  ensureDirSync(rootDir);
  const ReqFile = rootDir+'/Req/001.txt';

  watchFile(ReqFile, async(curr, prev) => {

      await readFile(ReqFile, fileEncoding, (err, data) => {
          if(err) throw err;
          const linesUnformatted = data.split('\n');

          // if send order correctly
          const line0 = linesUnformatted[0].split('='); //type file
          const line1 = linesUnformatted[1].split('=') //order Number
          const line2 = linesUnformatted[2].split('=') //order value
          const line3 = linesUnformatted[3].split('=') //pix format
          const line4 = linesUnformatted[4] //file end
          const formatData = {
              fileType: line0[1].trim(),
              orderNumber: line1[1].trim(),
              orderValue: line2[1].trim(),
              pixFormat: line3[1].trim(),
              filEnd: line4
          }
          callback(formatData)
      })

  })

  return () => {
      unwatchFile(ReqFile)
      // watcher.close()
  }
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mbjpay')
  
  createWindow()
  // const file = getFileReq()
 
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  watchFileAndFormat( (formatData) => {
    mainWindow.webContents.send('file-content', formatData);
  })

  // ipcMain.on('mkdir', createPath);

  ipcMain.handle('create-paths', (event) => {
    createPath();
    return true;
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