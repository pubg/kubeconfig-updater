import 'electron'
import Store from 'electron-store'
import EventEmitter from 'events'

declare global {
  function openLogDir(): void
  function openBackendConfigDir(): void
  function shouldUseDarkColors(): boolean
  const clientConfigStore: Pick<Store, 'get' | 'set' | 'onDidChange'>
  const nativeThemeEvent: Pick<EventEmitter, 'on'> | undefined
}

export {}
