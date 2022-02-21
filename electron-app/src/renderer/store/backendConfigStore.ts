import * as mobx from 'mobx'
import * as tsyringe from 'tsyringe'

@tsyringe.singleton()
export default class BackendConfigStore {
  @mobx.computed
  get value(): string {
    return `\
{
  "foo": "bar",
  "num": 1234,
  "bool": true
}
`
  }

  @mobx.observable
  private _value: string = ''

  constructor() {
    mobx.makeObservable(this)
  }

  @mobx.flow
  *fetchConfig() {
    yield new Error('method not implemented.')
  }

  @mobx.flow
  *saveConfig(data: string) {
    yield new Error('method not implemented.')
  }
}
