import 'electron'
import { opendir } from 'fs'

declare global {
  namespace IPCType {
    type IPCPortRequestType = 'getGrpcWebPort'
    type IPCThemeType = 'theme' | 'theme:getTheme'
  }

  type OpenDirType = 'openLogDir' | 'openBackendConfigDir'
  type IPCType = IPCType.IPCPortRequestType | IPCType.IPCThemeType | 'ipc-test' | 'themeFunc' | 'openURL' | OpenDirType

  namespace Electron {
    interface ContextBridge {
      exposeInMainWorld(apiKey: IPCType, api: any): void
    }

    interface IpcMain {
      on(channel: IPCType, listener: (event: IpcMainEvent, ...args: any[]) => void): this
    }
  }

  function opendir(): void
}

export {}
