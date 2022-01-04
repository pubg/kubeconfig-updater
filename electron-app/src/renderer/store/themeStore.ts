import { action, computed, makeObservable, observable } from 'mobx'
import { Theme as FluentUiTheme } from '@fluentui/react'
import { AzureThemeDark, AzureThemeLight } from '@fluentui/azure-themes'
import { Theme as MuiTheme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import { inject, singleton } from 'tsyringe'
import { ThemePreferredType, ThemeRepository, ThemeType } from '../repositories/themeRepository'

@singleton()
export default class ThemeStore {
  /** @readonly */
  @observable
  private _theme: ThemeType = 'light'

  get theme(): ThemeType {
    return this._theme
  }

  @computed
  get muiTheme(): MuiTheme {
    return createTheme({
      palette: {
        mode: this.theme as PaletteMode,
      },
    })
  }

  // TODO: change string inject to Token (or Symbol?)
  constructor(@inject('ThemeRepository') readonly storage: ThemeRepository) {
    makeObservable(this)
    this._theme = this.storage.getTheme()
  }

  @action
  setPreferredTheme(targetTheme: ThemePreferredType) {
    this.storage.setPreferredTheme(targetTheme)
    this._theme = this.storage.getTheme()
  }

  getPreferredTheme(): ThemePreferredType {
    return this.storage.getPreferredTheme()
  }

  getFluentUiTheme(): FluentUiTheme {
    if (this.theme === 'dark') {
      return AzureThemeDark
    }
    return AzureThemeLight
  }
}
