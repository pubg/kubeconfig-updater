const { contextBridge, ipcRenderer, shell } = require('electron')
const electronLogger = require('electron-log').create('renderer')

electronLogger.transports.console.format = '[{level}]{scope} {text}'

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
