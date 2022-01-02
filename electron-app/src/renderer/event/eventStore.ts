import { action, makeAutoObservable, makeObservable, observable } from 'mobx'

export default class EventStore<T> {
  @observable
  _value?: T = undefined // must provide "undefined" or it won't work

  constructor() {
    makeObservable(this)
  }

  @action
  emit(value: T): void {
    this._value = value
  }
}
