import { flow, makeAutoObservable, makeObservable, observable, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import { CredResolverConfig, GetCredResolversRes } from '../protos/kubeconfig_service_pb'
import CredResolverRepository from '../repositories/credResolverRepository'

// TODO: move this type declaration to model/ directory?
// @observable
type CredResolver = CredResolverConfig.AsObject
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
  private _credResolvers: CredResolver[] = []

  /**
   * updated when array length is changed
   * item will be changed in-place on update
   */
  get credResolvers() {
    return this._credResolvers
  }

  constructor(private readonly credResolverRepository: CredResolverRepository) {
    makeObservable(this)
  }

  /**
   * update resolvers to match backend state.
   */
  fetchCredResolver = flow(function* (this: CredResolverStore) {
    this.logger.debug('fetching cred resolvers...')
    const res: GetCredResolversRes = yield this.credResolverRepository.getCredResolvers()

    if (res.getCommonres()?.getStatus() === ResultCode.SUCCESS) {
      this._credResolvers = res.getConfigsList().map((c) => makeAutoObservable(c.toObject()))
      this.logger.debug(`fetched ${this.credResolvers.length} resolvers: `, toJS(this.credResolvers))
    } else {
      this.logger.error('failed fetching cred resolvers. error: ', res.getCommonres()?.getMessage())
    }
  })

  setCredResolver = flow(function* (this: CredResolverStore, ...params: RegisterCredResolverParams) {
    this.logger.info(`set cred resolver key: ${JSON.stringify(params[0])}, value: ${params[1]}`)
    const res: CommonRes = yield this.credResolverRepository.registerCredResolver(...params)

    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to set cred resolver. err: ', res.getMessage())
    }

    this.fetchCredResolver()
  })

  deleteCredResolver = flow(function* (this: CredResolverStore, accountId: string) {
    this.logger.info(`delete cred resolver key: ${accountId}`)

    const res: CommonRes = yield this.credResolverRepository.deleteCredResolver(accountId)

    if (res.getStatus() !== ResultCode.SUCCESS) {
      this.logger.error('failed to delete cred resolver. err: ', res.getMessage())
    }

    this.fetchCredResolver()
  })
}
