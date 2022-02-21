const { contextBridge, ipcRenderer, shell } = require('electron')
const electronLogger = require('electron-log').create('renderer')
const os = require('os')
const path = require('path')
const cp = require('child_process')

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

const theme = ipcRenderer.sendSync('theme:getTheme')
electronLogger.info(`[Preload] getTheme: ${theme}`)
contextBridge.exposeInMainWorld('theme', theme)

contextBridge.exposeInMainWorld('themeGetTheme', () => {
  const theme2 = ipcRenderer.sendSync('theme:getTheme')
  electronLogger.info(`[themeFunc] getTheme: ${theme2}`)
  return theme2
})

contextBridge.exposeInMainWorld('themeGetPreferredTheme', () => {
  const preferredTheme = ipcRenderer.sendSync('theme:getPreferredTheme')
  electronLogger.info(`[themeFunc] getPreferredTheme: ${preferredTheme}`)
  return preferredTheme
})

contextBridge.exposeInMainWorld('themeSetPreferredTheme', (preferredTheme) => {
  ipcRenderer.sendSync('theme:setPreferredTheme', preferredTheme)
  electronLogger.info(`[themeFunc] setPreferredTheme: ${preferredTheme}`)
})

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

const openLogDir = (dirPath: string) => {
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
