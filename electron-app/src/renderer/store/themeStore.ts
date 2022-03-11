import { action, computed, makeObservable, observable } from 'mobx'
import { Theme as FluentUiTheme } from '@fluentui/react'
import { AzureThemeDark, AzureThemeLight } from '@fluentui/azure-themes'
import { Theme as MuiTheme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import * as tsyringe from 'tsyringe'
import { ThemeType, ThemePreferredType } from '../types/theme/type'
import * as Theme from '../repositories/theme'

@tsyringe.singleton()
export default class ThemeStore {
  /** @readonly */
  @observable
  private _theme?: ThemeType = 'light'

  @computed
  get theme(): ThemeType {
    return this._theme ?? 'light'
  }

  // don't set this @computed
  get preferredTheme(): ThemePreferredType {
    return this.storage.getPreferredTheme() ?? 'system'
  }

  @computed
  get muiTheme(): MuiTheme {
    return createTheme({
      palette: {
        mode: this.theme as PaletteMode,
      },
    })
  }

  @computed
  get fluentUiTheme(): FluentUiTheme {
    if (this.theme === 'dark') {
      return AzureThemeDark
    }
    return AzureThemeLight
  }

  // TODO: change string inject to Token (or Symbol?)
  constructor(@tsyringe.inject(Theme.Registry.token) private readonly storage: Theme.Repository) {
    makeObservable(this)
    this._theme = this.storage.getTheme()
  }

  @action
  setPreferredTheme(targetTheme: ThemePreferredType) {
    this.storage.setPreferredTheme(targetTheme)
    this._theme = this.storage.getTheme()
  }
}
