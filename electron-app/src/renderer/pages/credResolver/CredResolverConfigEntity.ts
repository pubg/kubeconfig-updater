import { action, computed, observable } from 'mobx'
import { CredentialResolverKind, CredResolverConfig } from '../../protos/kubeconfig_service_pb'
import { RESOLVER_DEFAULT, RESOLVER_ENV, RESOLVER_IMDS, RESOLVER_PROFILE_FACTORY, RESOLVER_UNKNOWN } from './const'

type ConfigKindProfile = {
  kind: CredentialResolverKind.PROFILE
  profile: string
}

type ConfigKindOthers = {
  kind: Exclude<CredentialResolverKind, CredentialResolverKind.PROFILE>
}

type ConfigKind = ConfigKindProfile | ConfigKindOthers

export default class CredResolverConfigEntity {
  readonly accountId: string

  readonly vendor: string

  readonly accountAlias?: string

  @observable
  private _config: ConfigKind

  get config() {
    return this._config
  }

  @computed
  get value() {
    switch (this.config.kind) {
      case CredentialResolverKind.DEFAULT:
        return RESOLVER_DEFAULT
      case CredentialResolverKind.ENV:
        return RESOLVER_IMDS
      case CredentialResolverKind.IMDS:
        return RESOLVER_ENV
      case CredentialResolverKind.PROFILE:
        return RESOLVER_PROFILE_FACTORY(this.config.profile)

      default:
        return RESOLVER_UNKNOWN
    }
  }

  constructor(object: CredResolverConfig.AsObject) {
    this.accountId = object.accountid
    this.vendor = object.infravendor
    this.accountAlias = object.accountalias

    // TODO: refactor this
    const profile: string | undefined = object.resolverattributesMap.find(([key]) => key === 'profile')?.[1]
    this._config = { kind: object.kind, profile } as ConfigKind
  }

  setConfig(type: ConfigKindOthers['kind']): void
  setConfig(type: ConfigKindProfile['kind'], profile: string): void
  @action
  setConfig(type: ConfigKind['kind'], profile?: string): void {
    switch (type) {
      case CredentialResolverKind.PROFILE:
        this._config = { kind: type, profile } as ConfigKindProfile
        break

      default:
        this._config = { kind: type }
        break
    }
  }
}
