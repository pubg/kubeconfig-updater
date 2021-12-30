// eslint-disable-next-line max-classes-per-file
import browserLogger from '../logger/browserLogger'

export type ThemeType = 'dark' | 'light'
export type ThemePreferredType = ThemeType | 'system'
export type ThemeStorageType = 'browser' | 'electron'

export interface ThemeRepository {
  setPreferredTheme(theme: ThemePreferredType): void

  getPreferredTheme(): ThemePreferredType

  getTheme(): ThemeType
}

export class BrowserThemeImpl implements ThemeRepository {
  private preferredTheme: ThemePreferredType

  constructor(preferredTheme: ThemePreferredType) {
    this.preferredTheme = preferredTheme
  }

  setPreferredTheme(theme: ThemePreferredType) {
    this.preferredTheme = theme
  }

  getPreferredTheme(): ThemePreferredType {
    return this.preferredTheme
  }

  getTheme(): ThemeType {
    if (this.preferredTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.preferredTheme
  }
}

export class ElectronThemeImpl implements ThemeRepository {
  // eslint-disable-next-line class-methods-use-this
  setPreferredTheme(theme: ThemePreferredType) {
    if (window.themeSetPreferredTheme) {
      window.themeSetPreferredTheme(theme)
    } else {
      browserLogger.error('Electron preload script not work as expected, window.themeSetPreferredTheme is not defined')
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getPreferredTheme(): ThemePreferredType {
    if (window.themeGetPreferredTheme) {
      return window.themeGetPreferredTheme() as ThemePreferredType
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
