const { contextBridge, ipcRenderer, shell, nativeTheme } = require('electron')
const electronLogger = require('electron-log').create('renderer')
const os = require('os')
const path = require('path')
const cp = require('child_process')
const Store = require('electron-store')

electronLogger.transports.console.format = '[{level}]{scope} {text}'
// move past logs to main.old.log and clear the current log file.
const rendererLogFilePath = electronLogger.transports.file.getFile().path
electronLogger.transports.file.archiveLog(rendererLogFilePath)
electronLogger.transports.file.getFile().clear()

if (process.env.DEBUG_PROD !== 'true' && process.env.NODE_ENV === 'production') {
  electronLogger.transports.console.level = 'info'
  electronLogger.transports.file.level = 'info'
}

contextBridge.exposeInMainWorld('electronLogger', electronLogger.functions)

const grpcWebPort = ipcRenderer.sendSync('getGrpcWebPort')
contextBridge.exposeInMainWorld('grpcWebPort', grpcWebPort)
electronLogger.info(`[Preload] getGrpcWebPort: ${grpcWebPort}`)

contextBridge.exposeInMainWorld('managedFromElectron', true)

contextBridge.exposeInMainWorld('openURL', (url) => {
  shell.openExternal(url)
})

const platform = os.platform()
const homedir = os.homedir()
const logPath = (() => {
  switch (platform) {
    case 'win32':
      return path.join(homedir, 'AppData', 'Roaming', 'kubeconfig-updater', 'logs')

    case 'darwin':
      return path.join(homedir, 'Library', 'Logs', 'kubeconfig-updater')

    default:
      throw new Error(`platform ${platform} is not supported.`)
  }
})()

const backendConfigDir = path.join(homedir, '.kubeconfig-updater-gui')

const openLogDir = (dirPath) => {
  switch (platform) {
    case 'win32':
      return () => {
        cp.execSync(`start ${dirPath}`)
      }

    case 'darwin':
      return () => {
        cp.execSync(`open ${dirPath}`)
      }

    default:
      throw new Error(`platform ${platform} is not supported.`)
  }
}

contextBridge.exposeInMainWorld('openLogDir', openLogDir(logPath))
contextBridge.exposeInMainWorld('openBackendConfigDir', openLogDir(backendConfigDir))

const clientConfigStore = new Store()
contextBridge.exposeInMainWorld('clientConfigStore', {
  get: clientConfigStore.get.bind(clientConfigStore),
  set: clientConfigStore.set.bind(clientConfigStore),
  onDidChange: clientConfigStore.onDidChange.bind(clientConfigStore),
})

contextBridge.exposeInMainWorld('nativeTheme', nativeTheme)
