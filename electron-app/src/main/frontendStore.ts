import Store from 'electron-store'
import { singleton } from 'tsyringe'

@singleton()
export default class FrontendStore {
  private store: Store

  constructor() {
    this.store = new Store()
  }

  getPreferredTheme(): string {
    const theme: any = this.store.get('theme')

    return theme?.type ?? 'system'
  }

  setPreferredTheme(theme: string) {
    this.store.set('theme')
  }
}
