import * as tsyringe from 'tsyringe'
import { BrowserRepository } from './browserRepository'
import { ElectronRepository } from './electronRepository'

@tsyringe.registry([
  {
    token: Registry.token,
    useFactory: (c) => {
      if (window.managedFromElectron) {
        return c.resolve(ElectronRepository)
      }

      return c.resolve(BrowserRepository)
    },
  },
])
export class Registry {
  static readonly token = Symbol(Registry.name)
}
