import { flow, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import { CredResolverConfig, GetCredResolversRes } from '../protos/kubeconfig_service_pb'
import CredResolverRepository from '../repositories/credResolverRepository'

type CredResolver = CredResolverConfig.AsObject
type RegisterCredResolverParams = Parameters<CredResolverRepository['registerCredResolver']>

@singleton()
export default class CredResolverStore {
  private readonly logger = browserLogger

  @observable
  private _credResolvers: CredResolver[] = []

  get credResolvers() {
    return this._credResolvers
  }

  constructor(private readonly credResolverRepository: CredResolverRepository) {
    makeObservable(this)
  }

  fetchCredResolver = flow(function* (this: CredResolverStore) {
    this.logger.info('fetching cred resolvers...')
    const res: GetCredResolversRes = yield this.credResolverRepository.getCredResolvers()

    if (res.getCommonres()?.getStatus() === ResultCode.SUCCESS) {
      this._credResolvers = res.getConfigsList().map((c) => c.toObject())
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
}
