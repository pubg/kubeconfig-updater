import * as tsyringe from 'tsyringe'
import * as Theme from '../../types/theme/type'
import * as UIConfig from '../UIConfig'
import { Repository } from './repository'

@tsyringe.singleton()
export class ElectronRepository extends Repository {
  constructor(@tsyringe.inject(UIConfig.Registry.token) protected readonly uiConfigRepository: UIConfig.Repository) {
    super()
  }

  getTheme(): Theme.ThemeType | undefined {
    const theme = this.getPreferredTheme()

    if (theme === 'system') {
      console.log('shouldUseDarkColors: ', shouldUseDarkColors())
      if (shouldUseDarkColors()) {
        return 'dark'
      }

      return 'light'
    }

    return theme
  }
}
