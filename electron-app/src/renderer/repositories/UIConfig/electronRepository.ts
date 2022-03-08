import * as tsyringe from 'tsyringe'
import { Repository } from './repository'

@tsyringe.singleton()
export class ElectronRepository implements Repository {
  get<T>(key: string): T | undefined {
    return clientConfigStore.get(key, undefined) as T | undefined
  }

  set<T>(key: string, value: T): void {
    clientConfigStore.set(key, value)
  }
}
