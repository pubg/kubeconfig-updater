import { makeObservable, observable } from 'mobx'
import { CredentialResolverKind, CredentialResolverStatus, CredResolverConfig } from '../protos/kubeconfig_service_pb'

export default class ObservedCredResolverConfig implements CredResolverConfig.AsObject {
  /** @readonly */
  @observable
  accountid!: string

  /** @readonly */
  @observable
  infravendor!: string

  /** @readonly */
  @observable
  accountalias!: string

  /** @readonly */
  @observable
  kind!: CredentialResolverKind

  /** @readonly */
  @observable.ref
  resolverattributesMap!: [string, string][]

  /** @readonly */
  @observable
  status!: CredentialResolverStatus

  /** @readonly */
  @observable
  statusdetail!: string

  constructor(object: CredResolverConfig.AsObject) {
    Object.assign(this, object)
    makeObservable(this)
  }
}
