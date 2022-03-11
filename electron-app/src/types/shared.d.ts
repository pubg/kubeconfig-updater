import 'electron'
import Store from 'electron-store'

declare global {
  namespace IPCType {
    type IPCPortRequestType = 'getGrpcWebPort'
  }

  type OpenDirType = 'openLogDir' | 'openBackendConfigDir'

  type IPCType =
    | IPCType.IPCPortRequestType
    | 'ipc-test'
    | 'openURL'
    | OpenDirType
    | 'clientConfigStore'
    | 'theme.shouldUseDarkColors'

  namespace Electron {
    // interface ContextBridge {
    // exposeInMainWorld(apiKey: string, api: any): void
    // }

    interface IpcMain {
      on(channel: IPCType, listener: (event: IpcMainEvent, ...args: any[]) => void): this
    }
  }

  function openLogDir(): void
  function openBackendConfigDir(): void
  function shouldUseDarkColors(): boolean
  const clientConfigStore: Pick<Store, 'get' | 'set' | 'onDidChange'>
}

export {}
