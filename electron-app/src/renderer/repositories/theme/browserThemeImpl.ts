import * as tsyringe from 'tsyringe'
import { ThemePreferredType, ThemeType } from '../../types/theme/type'
import { Repository } from './repository'

@tsyringe.injectable()
export class BrowserThemeImpl implements Repository {
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
