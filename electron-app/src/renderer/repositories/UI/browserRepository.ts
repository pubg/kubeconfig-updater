import * as tsyringe from 'tsyringe'
import { Repository } from './repository'

@tsyringe.injectable()
export class BrowserRepository implements Repository {
  get<T>(key: string): T | undefined {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value) as T
    }

    return undefined
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
