import { makeObservable, observable } from 'mobx'
import { ResultCode } from '../protos/common_pb'
import { CredentialResolverKind, CredentialResolverStatus, CredResolverConfig } from '../protos/kubeconfig_service_pb'

interface Response {
  resolved?: boolean
  data?: {
    resultCode: ResultCode
    message: string
  }
}

export default class ObservedCredResolverConfig implements CredResolverConfig.AsObject {
  /** @readonly */
  @observable
  accountid: string = ''

  /** @readonly */
  @observable
  infravendor: string = ''

  /** @readonly */
  @observable
  accountalias: string = ''

  /** @readonly */
  @observable
  kind: CredentialResolverKind = CredentialResolverKind.DEFAULT

  /** @readonly */
  @observable.ref
  resolverattributesMap: [string, string][] = []

  /** @readonly */
  @observable
  status: CredentialResolverStatus = CredentialResolverStatus.CRED_RESOLVER_UNKNOWN

  /** @readonly */
  @observable
  statusdetail: string = ''

  // stores response of update request of this single config data
  @observable
  response?: Response = undefined

  constructor(object: CredResolverConfig.AsObject) {
    Object.assign(this, object)
    makeObservable(this)
  }
}
