const { contextBridge, ipcRenderer } = require('electron')
const { default: logger } = require('logger/logger')

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

logger.info(`using grpcWebPort: ${grpcWebPort}`)
