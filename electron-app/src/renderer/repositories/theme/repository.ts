import * as Theme from '../../types/theme/type'
import * as UIConfig from '../UIConfig'

export abstract class Repository {
  protected abstract get uiConfigRepository(): UIConfig.Repository

  getPreferredTheme(): Theme.ThemePreferredType | undefined {
    return this.uiConfigRepository.get('theme.type')
  }

  setPreferredTheme(theme: Theme.ThemePreferredType): void {
    this.uiConfigRepository.set('theme.type', theme)
  }

  abstract getTheme(): Theme.ThemeType | undefined
}
