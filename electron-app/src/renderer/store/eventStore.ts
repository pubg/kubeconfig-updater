import { action, observable } from 'mobx'

// TODO: find a better way to propagate Error
export default class EventStore<T> {
  @observable
  _value: T | null = null

  @action emit(value: T) {
    this._value = value
  }
}
