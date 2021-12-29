// eslint-disable-next-line max-classes-per-file
import { action, makeObservable, observable } from 'mobx'
import { Theme as FluentUiTheme } from '@fluentui/react'
import { AzureThemeDark, AzureThemeLight } from '@fluentui/azure-themes'
import { Theme as MuiTheme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import browserLogger from '../logger/browserLogger'

export type ThemeType = 'dark' | 'light' | 'system'
export type ThemeStorageType = 'browser' | 'electron'

interface ThemeStorage {
  setPreferredTheme(theme: ThemeType): void

  getPreferredTheme(): ThemeType

  getTheme(): ThemeType
}

class BrowserThemeStorage implements ThemeStorage {
  private preferredTheme: ThemeType

  constructor(preferredTheme: ThemeType) {
    this.preferredTheme = preferredTheme
  }

  setPreferredTheme(theme: ThemeType) {
    this.preferredTheme = theme
  }

  getPreferredTheme(): ThemeType {
    return this.preferredTheme
  }

  getTheme(): ThemeType {
    if (this.preferredTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.preferredTheme
  }
}

class ElectronThemeStorage implements ThemeStorage {
  // eslint-disable-next-line class-methods-use-this
  setPreferredTheme(theme: ThemeType) {
    if (window.themeSetPreferredTheme) {
      window.themeSetPreferredTheme(theme)
    } else {
      browserLogger.error('Electron preload script not work as expected, window.themeSetPreferredTheme is not defined')
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getPreferredTheme(): ThemeType {
    if (window.themeGetPreferredTheme) {
      return window.themeGetPreferredTheme() as ThemeType
    }
    browserLogger.error('Electron preload script not work as expected, window.themeGetPreferredTheme is not defined')
    return 'light'
  }

  // eslint-disable-next-line class-methods-use-this
  getTheme(): ThemeType {
    if (window.themeGetTheme) {
      return window.themeGetTheme() as ThemeType
    }
    browserLogger.error('Electron preload script not work as expected, window.themeGetTheme is not defined')
    return 'light'
  }
}

export class ThemeStore {
  /** @readonly */
  @observable
  theme: ThemeType = 'light'

  storage: ThemeStorage

  constructor(storageType: ThemeStorageType) {
    console.log('New ThemeStore Instance')
    if (storageType === 'browser') {
      this.storage = new BrowserThemeStorage('system')
    } else {
      this.storage = new ElectronThemeStorage()
    }
    this.theme = this.storage.getTheme()
    makeObservable(this)
  }

  @action
  setPreferredTheme(targetTheme: ThemeType) {
    this.storage.setPreferredTheme(targetTheme)
    this.theme = this.storage.getTheme()
  }

  getPreferredTheme(): ThemeType {
    return this.storage.getPreferredTheme()
  }

  getFluentUiTheme(): FluentUiTheme {
    if (this.theme === 'dark') {
      return AzureThemeDark
    }
    return AzureThemeLight
  }

  getMuiTheme(): MuiTheme {
    return createTheme({
      palette: {
        mode: this.theme as PaletteMode,
      },
    })
  }
}
