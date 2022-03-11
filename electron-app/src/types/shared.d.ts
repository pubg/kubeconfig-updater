import 'electron'
import Store from 'electron-store'

declare global {
  namespace IPCType {
    type IPCPortRequestType = 'getGrpcWebPort'
  }

  type OpenDirType = 'openLogDir' | 'openBackendConfigDir'
  type IPCType = IPCType.IPCPortRequestType | 'ipc-test' | 'openURL' | OpenDirType | 'clientConfigStore'

  namespace Electron {
    interface ContextBridge {
      exposeInMainWorld(apiKey: IPCType, api: any): void
    }

    interface IpcMain {
      on(channel: IPCType, listener: (event: IpcMainEvent, ...args: any[]) => void): this
    }
  }

  function openLogDir(): void
  function openBackendConfigDir(): void
  const clientConfigStore: Pick<Store, 'get' | 'set' | 'onDidChange'>
}

export {}
