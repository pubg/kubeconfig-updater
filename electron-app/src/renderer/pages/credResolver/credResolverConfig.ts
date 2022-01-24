import { action, computed, makeObservable, observable } from 'mobx'
import { getType, RESOLVER_DEFAULT, RESOLVER_ENV, RESOLVER_IMDS, RESOLVER_UNKNOWN } from './const'
import { ResultCode } from '../../protos/common_pb'
import {
  CredentialResolverKind,
  CredentialResolverStatus,
  CredResolverConfig,
} from '../../protos/kubeconfig_service_pb'

export default class ObservedCredResolverConfig implements CredResolverConfig.AsObject {
  readonly accountid: string = ''

  readonly infravendor: string = ''

  readonly accountalias: string = ''

  @observable
  _kind: CredentialResolverKind = CredentialResolverKind.DEFAULT

  @computed
  get kind() {
    return this._kind
  }

  @observable
  private _resolveAttributeMap: Map<string, string>

  @computed
  get resolverattributesMap(): [string, string][] {
    return [...this._resolveAttributeMap.entries()]
  }

  @observable
  private _status: CredentialResolverStatus = CredentialResolverStatus.CRED_RESOLVER_UNKNOWN

  @computed
  get status() {
    return this._status
  }

  @observable
  private _statusdetail: string = ''

  @computed
  get statusdetail() {
    return this._statusdetail
  }

  @computed
  get profile(): string | undefined {
    return this._resolveAttributeMap.get('profile')
  }

  @computed
  get currentValue() {
    const { profile } = this
    switch (this.kind) {
      case CredentialResolverKind.DEFAULT:
        return RESOLVER_DEFAULT

      case CredentialResolverKind.ENV:
        return RESOLVER_ENV

      case CredentialResolverKind.IMDS:
        return RESOLVER_IMDS

      case CredentialResolverKind.PROFILE:
        return profile ?? RESOLVER_UNKNOWN

      default:
        return RESOLVER_UNKNOWN
    }
  }

  constructor(object: CredResolverConfig.AsObject) {
    this.accountid = object.accountid
    this.infravendor = object.infravendor
    this.accountalias = object.accountalias

    this.updateConfigFromObject(object)
    this._resolveAttributeMap = observable.map(object.resolverattributesMap)

    makeObservable(this)
  }

  @action
  changeConfigType(value?: string) {
    const kind = getType(value)
    if (kind === CredentialResolverKind.PROFILE) {
      if (!value) {
        throw new Error('provided kind PROFILE but profile value is undefined')
      }

      this._kind = CredentialResolverKind.PROFILE
      this._resolveAttributeMap.set('profile', value)
    } else {
      this._kind = kind
      this._resolveAttributeMap.delete('profile')
    }
  }

  @action
  updateConfigFromObject(object: CredResolverConfig.AsObject) {
    this._kind = object.kind
    this._status = object.status
    this._statusdetail = object.statusdetail
    this._resolveAttributeMap = observable.map(object.resolverattributesMap)

    return this
  }
}
