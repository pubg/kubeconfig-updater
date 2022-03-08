import * as tsyringe from 'tsyringe'
import * as Theme from '../../types/theme/type'
import * as UIConfig from '../UIConfig'

export abstract class Repository {
  constructor(@tsyringe.inject(UIConfig.Registry.token) private readonly UIConfigRepository: UIConfig.Repository) {}

  getPreferredTheme(): Theme.ThemePreferredType | undefined {
    return this.UIConfigRepository.get('theme.type')
  }

  setPreferredTheme(theme: Theme.ThemePreferredType): void {
    this.UIConfigRepository.set('theme.type', theme)
  }

  abstract getTheme(): Theme.ThemeType | undefined
}
