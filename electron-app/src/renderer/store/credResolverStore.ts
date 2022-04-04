/* eslint-disable class-methods-use-this */
import dayjs from 'dayjs'
import _ from 'lodash'
import { action, computed, flow, makeObservable, observable, runInAction, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import ObservedCredResolverConfig from '../pages/credResolver/credResolverConfig'
import { CommonRes, ResultCode } from '../protos/common_pb'
import { CredResolverConfig, GetCredResolversRes } from '../protos/kubeconfig_service_pb'
import CredResolverRepository from '../repositories/credResolverRepository'
import { PayloadMap } from '../types/payloadMap'

export interface Payload {
  resolved?: boolean
  data?: {
    resultCode: ResultCode
    message: string
  }
}

/**
 * CredResolverStore provides CRUD functionality to application.
 */
@singleton()
export default class CredResolverStore {
  private readonly logger = browserLogger

  private readonly _credResolverMap: PayloadMap<ObservedCredResolverConfig, Payload> = new PayloadMap(
    (object) => object.accountid
  )

  /**
   * updated when array length is changed
   * item will be changed in-place on update
   */
  @computed
  get credResolvers() {
    // TODO: find this array to be ordered or not
    return [...this._credResolverMap.values()]
  }

  private lastUpdated = dayjs('1970-01-01')

  private readonly expiredMinute = 5

  @observable
  private _state: 'ready' | 'fetch' = 'ready'

  @computed
  get isLoading() {
    return this._state
  }

  constructor(private readonly credResolverRepository: CredResolverRepository) {
    makeObservable(this)
  }

  /**
   * update resolvers to match backend state.
   * @param ignoreCache if enabled, always fetch data from backend whether cache is expired or not.
   * @param skipSync if enabled, skip calling backend to sync cred resolvers (for fast reload.)
   */
  fetchCredResolver = flow(function* (this: CredResolverStore, ignoreCache = false, skipSync = false) {
    if (ignoreCache || this.isCacheExpired()) {
      try {
        this._state = 'fetch'

        if (skipSync) {
          this.logger.debug('sync cred resolver is skipped.')
        } else {
          this.logger.debug('sync cred resolvers...')
          yield this.credResolverRepository.SyncAvailableCredResolvers()
        }

        this.logger.debug('fetching cred resolvers...')
        const res: GetCredResolversRes = yield this.credResolverRepository.getCredResolvers()

        if (res.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
          this.logger.error('failed fetching cred resolvers. error: ', res.getCommonres()?.getMessage())
          return
        }

        this.syncCredResolvers(res.getConfigsList())
        this.lastUpdated = dayjs()
      } catch (e) {
        this.logger.error(`Unexpected error: ${e}`)
      } finally {
        this._state = 'ready'
      }
    } else {
      this.clearPayloads()
    }
  })

  @action
  private clearPayloads() {
    this.credResolvers.forEach((value) => {
      value.payload = null
    })
  }

  private isCacheExpired() {
    return this.lastUpdated.add(this.expiredMinute, 'minute').isBefore(dayjs())
  }

  setCredResolver = flow(async function* (this: CredResolverStore, value: ObservedCredResolverConfig) {
    this.logger.debug(`request set cred resolver, accountId: ${value.accountid}, infraVendor: ${value.infravendor}`)
    this.logger.debug('value: ', toJS(value))
    const isAddingConfig = !this._credResolverMap.has(value.accountid)

    this.setPayloadResolving(value.accountid)

    const res: CommonRes = yield this.credResolverRepository.setCredResolver(value)
    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to set cred resolver. err: ', res.getMessage())
      return
    }

    if (isAddingConfig) {
      yield this.fetchCredResolver(true, true)
    }

    yield this.fetchCredResolver(true)

    this.setPayloadResolved(value.accountid, res)
  })

  @action
  private setPayloadResolving(accountId: string) {
    const credResolver = this._credResolverMap.get(accountId)
    if (!credResolver) {
      return
    }

    credResolver.payload = {
      resolved: false,
      data: undefined,
    }
  }

  @action
  private setPayloadResolved(accountId: string, res: CommonRes) {
    const credResolver = this._credResolverMap.get(accountId)
    if (!credResolver) {
      throw new Error(`credResolver is not exist on map, accountId: ${accountId}`)
    }

    credResolver.payload = {
      resolved: true,
      data: {
        message: res.getMessage(),
        resultCode: res.getStatus(),
      },
    }
  }

  deleteCredResolver = flow(function* (this: CredResolverStore, accountId: string) {
    this.logger.info(`delete cred resolver key: ${accountId}`)

    const res: CommonRes = yield this.credResolverRepository.deleteCredResolver(accountId)

    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to delete cred resolver. err: ', res.getMessage())
    }

    this._credResolverMap.deleteWithKey(accountId)
  })

  // reset internal state and sync to backend state
  @action
  private syncCredResolvers(configs: CredResolverConfig[]) {
    this._credResolverMap.clear()

    for (const config of configs) {
      this.upsertCredResolver(config.toObject())
    }
  }

  /**
   * upsert credResolverConfig with given arguments, creates default config if value not exists
   * @param accountId
   * @param config if provided, instead of creation, it will shallow-copy object
   */
  @action
  private upsertCredResolver(config: CredResolverConfig.AsObject) {
    const observedConfig = this._credResolverMap.get(config.accountid)
    if (observedConfig) {
      this.updateCredResolver(observedConfig.value, config)
    } else {
      this.addCredResolver(config)
    }
  }

  @action
  private addCredResolver(config: CredResolverConfig.AsObject) {
    this._credResolverMap.add(new ObservedCredResolverConfig(config))
  }

  @action
  private updateCredResolver(observed: ObservedCredResolverConfig, value: CredResolverConfig.AsObject) {
    observed.updateConfigFromObject(value)
  }
}
