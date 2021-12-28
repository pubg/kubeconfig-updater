// eslint-disable-next-line max-classes-per-file
import {inject, injectable, singleton} from 'tsyringe'
import { action, makeObservable, observable } from 'mobx'

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
      console.log('error!!!')
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getPreferredTheme(): ThemeType {
    if (window.themeGetPreferredTheme) {
      return window.themeGetPreferredTheme() as ThemeType
    }
    console.log('error!!!')
    return 'light'
  }

  // eslint-disable-next-line class-methods-use-this
  getTheme(): ThemeType {
    if (window.themeGetTheme) {
      return window.themeGetTheme() as ThemeType
    }
    console.log('error!!!')
    return 'light'
  }
}

@singleton()
export class ThemeStore {
  /** @readonly */
  @observable
  theme: ThemeType

  storage: ThemeStorage

  // constructor(@inject('ThemeStorageType') storageType: ThemeStorageType) {
    constructor() {
    makeObservable(this)
    console.log('New ThemeStore Instance')
    if ('browser' === 'browser') {
      this.storage = new BrowserThemeStorage('system')
    } else {
      this.storage = new ElectronThemeStorage()
    }
    this.theme = this.storage.getTheme()
  }

  @action
  setPreferredTheme(targetTheme: ThemeType) {
    this.storage.setPreferredTheme(targetTheme)
    this.theme = this.storage.getTheme()
  }

  getPreferredTheme(): ThemeType {
    return this.storage.getPreferredTheme()
  }
}
