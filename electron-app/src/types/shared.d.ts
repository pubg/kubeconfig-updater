import 'electron'

declare global {
  namespace IPCType {
    type IPCPortRequestType = 'getGrpcWebPort'
    type IPCThemeType = 'theme' | 'theme:getTheme'
  }

  type IPCType = IPCType.IPCPortRequestType | IPCType.IPCThemeType | 'ipc-test'

  namespace Electron {
    interface ContextBridge {
      exposeInMainWorld(apiKey: IPCType, api: any): void
    }

    interface IpcMain {
      on(channel: IPCType, listener: (event: IpcMainEvent, ...args: any[]) => void): this
    }
  }
}

export {}
