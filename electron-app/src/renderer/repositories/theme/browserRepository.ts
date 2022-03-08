import * as tsyringe from 'tsyringe'
import * as Theme from '../../types/theme/type'
import * as UIConfig from '../UIConfig'
import { Repository } from './repository'

@tsyringe.singleton()
export class BrowserRepository extends Repository {
  getTheme(): Theme.ThemeType | undefined {
    const theme = this.getPreferredTheme()
    if (theme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return theme
  }
}
