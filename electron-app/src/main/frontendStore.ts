import Store from 'electron-store'
import { singleton } from 'tsyringe'

@singleton()
export default class FrontendStore {
  private store: Store

  constructor() {
    this.store = new Store()
  }

  getTheme(): string {
    return <string>this.store.get('theme', 'dark')
  }

  setTheme(theme: string) {
    this.store.set('theme', theme)
  }
}
