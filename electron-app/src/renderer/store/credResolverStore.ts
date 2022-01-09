import _ from 'lodash'
import { action, computed, flow, makeObservable, observable, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import ObservedCredResolverConfig from '../models/credResolverConfig'
import { CommonRes, ResultCode } from '../protos/common_pb'
import { CredResolverConfig, GetCredResolversRes } from '../protos/kubeconfig_service_pb'
import CredResolverRepository from '../repositories/credResolverRepository'

/**
 * CredResolverStore provides CRUD functionality to application.
 */
@singleton()
export default class CredResolverStore {
  private readonly logger = browserLogger

  // NOTE: every object in array is also a observable object
  // object is actually ES6 Map, not mobx observable converted, because of @observable.ref
  // don't use toJS() on this property
  @observable.ref
  private _credResolverMap: Map<string, ObservedCredResolverConfig> = new Map()

  /**
   * updated when array length is changed
   * item will be changed in-place on update
   */
  @computed
  get credResolvers() {
    // TODO: find this array to be ordered or not
    return [...this._credResolverMap.values()]
  }

  constructor(private readonly credResolverRepository: CredResolverRepository) {
    makeObservable(this)
  }

  /**
   * update resolvers to match backend state.
   */
  fetchCredResolver = flow(function* (this: CredResolverStore, reload = false) {
    if (reload) {
      // this._credResolverMap.clear() // NOTE: should I do this? no memory leak?
      this._credResolverMap = new Map()
    }

    this.logger.debug('fetching cred resolvers...')
    const res: GetCredResolversRes = yield this.credResolverRepository.getCredResolvers()

    if (res.getCommonres()?.getStatus() === ResultCode.SUCCESS) {
      const objects = res.getConfigsList().map((c) => c.toObject())
      this.updateCredResolvers(objects)
      // TODO: fix this logging error
      // this.logger.debug(`fetched ${this.credResolvers.length} resolvers: `, JSON.stringify(this._credResolverMap))
    } else {
      this.logger.error('failed fetching cred resolvers. error: ', res.getCommonres()?.getMessage())
    }
  })

  // TODO: break down this function
  setCredResolver = flow(function* (this: CredResolverStore, value: ObservedCredResolverConfig) {
    this.logger.debug(`request set cred resolver, accountId: ${value.accountid}, infraVendor: ${value.infravendor}`)
    this.logger.debug('value: ', toJS(value))

    value.response = {
      resolved: false,
    }

    // TODO: refactor this
    const res: CommonRes = yield this.credResolverRepository.setCredResolver(value)

    this.logger.debug('response: ', res.toObject())

    this.fetchCredResolver()

    const newConfig = this._credResolverMap.get(value.accountid)
    if (!newConfig) {
      // WTF?
      // when adding new set failed?
      // do I have to pass this error as event?
      this.logger.error('failed setting new config: ', value)
      return
    }

    if (newConfig.response) {
      newConfig.response.resolved = true
      newConfig.response.data = {
        resultCode: res.getStatus(),
        message: res.getMessage(),
      }
    } else {
      throw new Error('response property is not defined')
    }

    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to set cred resolver. err: ', res.getMessage())
    }
  })

  deleteCredResolver = flow(function* (this: CredResolverStore, accountId: string) {
    this.logger.info(`delete cred resolver key: ${accountId}`)

    const res: CommonRes = yield this.credResolverRepository.deleteCredResolver(accountId)

    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to delete cred resolver. err: ', res.getMessage())
    }

    this.fetchCredResolver()
  })

  @action
  private updateCredResolvers(newArray: CredResolverConfig.AsObject[]) {
    this.logger.debug('init updating cred resolvers, value: ', toJS(newArray))
    const comparator = (v1: CredResolverConfig.AsObject, v2: CredResolverConfig.AsObject) =>
      v1.accountid === v2.accountid

    const added = _.differenceWith(newArray, this.credResolvers, comparator)
    const updated = _.intersectionWith(newArray, this.credResolvers, comparator)
    const deleted = _.differenceWith(this.credResolvers, newArray, comparator)
    this.logger.debug(`added: ${added.length}, updated: ${updated.length}, deleted: ${deleted.length}`)

    const needToUpdateArray = added.length > 0 || deleted.length > 0

    for (const newValue of updated) {
      const config = this._credResolverMap.get(newValue.accountid)
      if (!config) {
        throw new Error()
      }

      // this.logger.debug('updating old credResolverConfig to new value')
      // this.logger.debug('old: ', toJS(config))
      // this.logger.debug('new: ', toJS(newValue))

      // update to new values
      config.kind = newValue.kind
      config.resolverattributesMap = newValue.resolverattributesMap
      config.status = newValue.status
      config.statusdetail = newValue.statusdetail
    }

    for (const value of added) {
      this._credResolverMap.set(value.accountid, observable(value) as ObservedCredResolverConfig)
    }

    for (const value of deleted) {
      this._credResolverMap.delete(value.accountid)
    }

    if (needToUpdateArray) {
      // allocate a new array to invoke mobx autoruns, etc...
      this._credResolverMap = new Map(this._credResolverMap)
      // this.logger.debug('updating internal map to a new instance, value: ', this._credResolverMap)
    }
  }
}
