const { contextBridge, ipcRenderer } = require('electron')
const electronLogger = require('electron-log').create('renderer')

electronLogger.transports.console.format = '[{level}]{scope} {text}'

if (process.env.DEBUG_PROD !== 'true' && process.env.NODE_ENV === 'production') {
  electronLogger.transports.console.level = 'info'
  electronLogger.transports.file.level = 'info'
}

contextBridge.exposeInMainWorld('electronLogger', electronLogger.functions)

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping')
    },
    on(channel, func) {
      const validChannels = ['ipc-example']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args))
      }
    },
  },
})

const grpcWebPort = ipcRenderer.sendSync('getGrpcWebPort')
contextBridge.exposeInMainWorld('grpcWebPort', grpcWebPort)
electronLogger.info(`[Preload] getGrpcWebPort: ${grpcWebPort}`)

const theme = ipcRenderer.sendSync('theme:getTheme')
electronLogger.info(`[Preload] getTheme: ${theme}`)
contextBridge.exposeInMainWorld('theme', theme)
