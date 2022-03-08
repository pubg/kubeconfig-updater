import * as tsyringe from 'tsyringe'
import { BrowserThemeImpl } from './browserThemeImpl'
import { ElectronThemeImpl } from './electronThemeImpl'

@tsyringe.registry([
  {
    token: Registry.token,
    useFactory: (c) => {
      if (window.managedFromElectron) {
        return c.resolve(ElectronThemeImpl)
      }

      return c.resolve(BrowserThemeImpl)
    },
  },
])
export abstract class Registry {
  static readonly token = Symbol(Registry.name)
}
