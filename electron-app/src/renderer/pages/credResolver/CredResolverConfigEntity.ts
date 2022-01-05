import { action, observable } from 'mobx'
import { CredentialResolverKind, CredResolverConfig } from '../../protos/kubeconfig_service_pb'

type ConfigKindProfile = {
  kind: CredentialResolverKind.PROFILE
  profile: string
}

type ConfigKindOthers = {
  kind: Omit<CredentialResolverKind, CredentialResolverKind.PROFILE>
}

type ConfigKind = ConfigKindProfile | ConfigKindOthers

export default class CredResolverConfigEntity {
  readonly accountId: string

  readonly accountAlias?: string

  @observable
  private _config: ConfigKind

  get config() {
    return this._config
  }

  constructor(object: CredResolverConfig.AsObject) {
    this.accountId = object.accountid
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
