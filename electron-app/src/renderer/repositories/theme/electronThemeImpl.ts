import * as tsyringe from 'tsyringe'
import browserLogger from '../../logger/browserLogger'
import { ThemePreferredType, ThemeType } from '../../types/theme/type'
import { Repository } from './repository'

@tsyringe.injectable()
export class ElectronThemeImpl implements Repository {
  setPreferredTheme(theme: ThemePreferredType) {
    if (window.themeSetPreferredTheme) {
      window.themeSetPreferredTheme(theme)
    } else {
      browserLogger.error('Electron preload script not work as expected, window.themeSetPreferredTheme is not defined')
    }
  }

  getPreferredTheme(): ThemePreferredType {
    if (window.themeGetPreferredTheme) {
      return window.themeGetPreferredTheme() as ThemePreferredType
    }
    browserLogger.error('Electron preload script not work as expected, window.themeGetPreferredTheme is not defined')
    return 'light'
  }

  getTheme(): ThemeType {
    if (window.themeGetTheme) {
      return window.themeGetTheme() as ThemeType
    }
    browserLogger.error('Electron preload script not work as expected, window.themeGetTheme is not defined')
    return 'light'
  }
}
