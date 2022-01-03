// eslint-disable-next-line max-classes-per-file
import { action, makeObservable, observable } from 'mobx'
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
  theme: ThemeType = 'light'

  constructor(@inject('ThemeRepository') readonly storage: ThemeRepository) {
    this.theme = this.storage.getTheme()
    makeObservable(this)
  }

  @action
  setPreferredTheme(targetTheme: ThemePreferredType) {
    this.storage.setPreferredTheme(targetTheme)
    this.theme = this.storage.getTheme()
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

  getMuiTheme(): MuiTheme {
    return createTheme({
      palette: {
        mode: this.theme as PaletteMode,
      },
    })
  }
}
