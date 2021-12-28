import {injectable, singleton} from 'tsyringe'
import {action, makeObservable, observable} from 'mobx'

export type ThemeType = 'dark' | 'light' | 'system'

@singleton()
export class ThemeStore {
  constructor() {
    makeObservable(this)
  }

  /** @readonly */
  @observable
  theme: ThemeType = ThemeStore.getDefaultTheme()

  private preferredTheme: ThemeType = ThemeStore.getDefaultTheme()

  @action
  setPreferredTheme(targetTheme: ThemeType) {
    this.preferredTheme = targetTheme
    if (this.preferredTheme === 'system') {
      this.theme = ThemeStore.getDefaultTheme()
    } else {
      this.theme = this.preferredTheme
    }
  }

  // eslint-disable-next-line class-methods-use-this
  static getDefaultTheme(): ThemeType {
    return 'light'
  }
}
