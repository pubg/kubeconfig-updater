/* eslint global-require: off, no-console: off, promise/always-return: off */

// tsyringe require this module. https://github.com/microsoft/tsyringe
import 'reflect-metadata'

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `pnpm run build` or `pnpm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { container } from 'tsyringe'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import BackendManager from './backend/backend'
import { BackendExecCmd, BackendExecCwd, BackendGrpcPort, BackendGrpcWebPort } from './backend/symbols'
import logger from '../logger/logger'

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
  logger.info(msgTemplate(arg))
  event.reply('ipc-example', msgTemplate('pong'))
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
const isProduction = process.env.NODE_ENV === 'production'

if (isDevelopment) {
  require('electron-debug')()
}

if (isProduction) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

logger.debug(`isPacked: ${app.isPackaged}`)
logger.debug(`getAppPath: ${app.getAppPath()}`)
logger.debug(`getPath('exe'): ${app.getPath('exe')}`)
logger.debug(`env.NO_BACKEND: ${process.env.NO_BACKEND}`)

if (app.isPackaged) {
  const parsedPath = path.parse(app.getPath('exe'))
  if (process.platform === 'darwin') {
    container.register(BackendExecCwd, {
      useValue: path.join(parsedPath.dir, '../'),
    })
  } else {
    container.register(BackendExecCwd, {
      useValue: path.join(parsedPath.dir, './'),
    })
  }

  if (process.platform === 'win32') {
    container.register(BackendExecCmd, {
      useValue: 'kubeconfig-updater-backend.exe',
    })
  } else {
    container.register(BackendExecCmd, {
      useValue: './kubeconfig-updater-backend',
    })
  }
  container.register(BackendGrpcPort, { useValue: 0 })
  container.register(BackendGrpcWebPort, { useValue: 0 })
} else {
  container.register(BackendExecCwd, {
    useValue: path.join(process.cwd(), '../backend'),
  })
  container.register(BackendExecCmd, { useValue: 'go run main.go server' })
  container.register(BackendGrpcPort, { useValue: 10980 })
  container.register(BackendGrpcWebPort, { useValue: 10981 })
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(log.error)
}

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDevelopment,
    },
  })

  mainWindow.loadURL(resolveHtmlPath('index.html'))

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { ...details.requestHeaders, Origin: '*' } })
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*'],
        'Access-Control-Allow-Methods': ['*'],
      },
    })
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
}

/**
 * Add event listeners...
 */

app
  .whenReady()
  .then(() => {
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow()
    })

    if (process.env.NO_BACKEND) {
      logger.warn('starting without backend...')
    } else {
      const manager = container.resolve(BackendManager)
      manager.start()
    }

    ['SIGINT', 'SIGHUP', 'SIGTERM', 'SIGBREAK', 'SIGKILL'].forEach((signal) => {
      const sig = signal
      console.log(`Register Listen Event ${sig}`)
      process.on(sig, () => {
        console.log(`Process Signal Received:${sig}`)
        app.quit()
      })
    })
  })
  .catch(logger.error)

ipcMain.on('getGrpcWebPort', (event) => {
  const manager = container.resolve(BackendManager)
  logger.info(`Request Get Grpc Web Port ${manager.grpbWebPort}`)
  event.returnValue = manager.grpbWebPort
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async (event) => {
  const manager = container.resolve(BackendManager)
  if (manager.status === 'running') {
    event.preventDefault()
    await manager.end()
    app.quit()
  }
})
