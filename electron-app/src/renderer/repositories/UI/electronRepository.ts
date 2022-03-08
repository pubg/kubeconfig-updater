import * as tsyringe from 'tsyringe'
import { Repository } from './repository'

@tsyringe.injectable()
export class ElectronRepository implements Repository {
  get<T>(key: string): T | undefined {
    throw new Error('Method not implemented.')
  }

  set<T>(key: string, value: T): void {
    throw new Error('Method not implemented.')
  }
}
