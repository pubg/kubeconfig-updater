import * as mobx from 'mobx'
import * as tsyringe from 'tsyringe'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { ResultCode } from '../protos/common_pb'
import { GetConfigRes, SetConfigRes } from '../protos/kubeconfig_service_pb'
import ApplicationConfigRepository from '../repositories/applicationConfigRepository'

@tsyringe.singleton()
export default class ApplicationConfigStore {
  private readonly appConfigName = 'Application-Config'

  private log = browserLogger

  @mobx.computed
  get state() {
    return this._state
  }

  @mobx.observable
  private _state: 'ready' | 'fetch' = 'ready'

  @mobx.computed
  get value(): string {
    return this._value
  }

  @mobx.observable
  private _value: string = ''

  readonly errorEvent = new EventStore<Error>()

  constructor(private readonly repository: ApplicationConfigRepository) {
    mobx.makeObservable(this)
  }

  @mobx.flow
  *fetchConfig() {
    if (this._state !== 'ready') {
      return
    }

    this._state = 'fetch'

    const res: GetConfigRes = yield this.repository.getConfig(this.appConfigName)

    if (res.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      const err = new Error(`failed fetching application config, err: ${res.getCommonres()?.getMessage()}`)
      this.errorEvent.emit(err)
    }

    const data = res.getData()
    this._value = data

    this._state = 'ready'
  }

  @mobx.flow
  *saveConfig(data: string) {
    if (this._state !== 'ready') {
      return
    }

    this._state = 'fetch'

    const res: SetConfigRes = yield this.repository.setConfig(this.appConfigName, data)

    if (res.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      const err = new Error(`failed applying application config, err: ${res.getCommonres()?.getMessage()}`)
      this.errorEvent.emit(err)
    }

    this._state = 'ready'
  }
}
