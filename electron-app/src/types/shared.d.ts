import 'electron'
import Store from 'electron-store'
import EventEmitter from 'events'

declare global {
  /*
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
    | 'nativeTheme.updated'

  type ExposeApiKey = 'shouldUseDarkColors' | 'nativeThemeEvent' | 'clientConfigStore' | OpenDirType

  namespace Electron {
    interface ContextBridge {
      exposeInMainWorld(apiKey: ExposeApiKey, api: any): void
    }

    interface IpcMain {
      on(channel: IPCType, listener: (event: IpcMainEvent, ...args: any[]) => void): this
    }
  }
  */

  function openLogDir(): void
  function openBackendConfigDir(): void
  function shouldUseDarkColors(): boolean
  const clientConfigStore: Pick<Store, 'get' | 'set' | 'onDidChange'>
  const nativeThemeEvent: Pick<EventEmitter, 'on'> | undefined
}

export {}
