import { action, makeObservable, observable } from 'mobx'
import { OptionsObject, SnackbarMessage } from 'notistack'
import { singleton } from 'tsyringe'

type Item = {
  key: string
  message: SnackbarMessage
  options?: OptionsObject
}

@singleton()
export default class SnackbarStore {
  @observable
  notifications: Item[] = []

  constructor() {
    makeObservable(this)
  }

  @action
  push(item: Item) {
    this.notifications = [...this.notifications, item]
  }

  @action
  remove(key: string) {
    this.notifications = this.notifications.filter((x) => x.key !== key)
  }

  @action
  removeAll(keys: string[]) {
    this.notifications = this.notifications.filter((x) => !keys.includes(x.key))
  }
}
