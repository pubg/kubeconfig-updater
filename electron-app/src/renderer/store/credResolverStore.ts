import _ from 'lodash'
import { action, computed, flow, makeAutoObservable, makeObservable, observable, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import { ObservedCredResolverConfig } from '../pages/credResolver/type'
import { CommonRes, ResultCode } from '../protos/common_pb'
import { CredentialResolverKind, CredResolverConfig, GetCredResolversRes } from '../protos/kubeconfig_service_pb'
import CredResolverRepository from '../repositories/credResolverRepository'

// TODO: move this type declaration to model/ directory?
// @observable
type RegisterCredResolverParams = Parameters<CredResolverRepository['registerCredResolver']>

/**
 * CredResolverStore provides CRUD functionality to application.
 */
@singleton()
export default class CredResolverStore {
  private readonly logger = browserLogger

  // TODO: internal map 을 만들어서 in-place update 지원하게 하기
  @observable
  // NOTE: every object in array is also a observable object
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
      // NOTE: toJS on @computed property doesn't work. (causes an "an object could not be cloned - electron ipc")
      // READ: https://github.com/mobxjs/mobx/issues/1532
      this.logger.debug(`fetched ${this.credResolvers.length} resolvers: `, toJS(this._credResolverMap))
    } else {
      this.logger.error('failed fetching cred resolvers. error: ', res.getCommonres()?.getMessage())
    }
  })

  // TODO: break down this function
  setCredResolver = flow(function* (this: CredResolverStore, param: CredResolverConfig.AsObject, profile?: string) {
    this.logger.debug(`request set cred resolver, accountId: ${param.accountid}, infraVendor: ${param.infravendor}`)

    // TODO: refactor this
    let res: CommonRes
    if (param.kind === CredentialResolverKind.PROFILE) {
      if (!profile) {
        throw new Error('expected profile value in config, but found undefined.')
      }

      res = yield this.credResolverRepository.registerCredResolver(param.accountid, param.infravendor, profile)
    } else {
      res = yield this.credResolverRepository.registerCredResolver(param.accountid, param.infravendor, param.kind)
    }

    this.logger.debug('response: ', res.toObject())

    this.fetchCredResolver()

    const config = this._credResolverMap.get(param.accountid)
    if (!config) {
      // WTF?
      // when adding new set failed?
      // do I have to pass this error as event?
      this.logger.error('failed setting new config: ', param)
      return
    }

    config.setResponse = {
      resultCode: res.getStatus(),
      message: res.getMessage(),
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

      this.logger.debug('updating old credResolverConfig to new value')
      this.logger.debug('old: ', toJS(config))
      this.logger.debug('new: ', toJS(newValue))

      // update to new values
      config.kind = newValue.kind
      config.resolverattributesMap = newValue.resolverattributesMap
      config.status = newValue.status
      config.statusdetail = newValue.statusdetail
    }

    for (const value of added) {
      this._credResolverMap.set(value.accountid, makeAutoObservable(value))
    }

    for (const value of deleted) {
      this._credResolverMap.delete(value.accountid)
    }

    if (needToUpdateArray) {
      // allocate a new array to invoke mobx autoruns, etc...
      this._credResolverMap = new Map(this._credResolverMap)
      this.logger.debug('updating internal map to a new instance, value: ', toJS(this._credResolverMap))
    }
  }
}
