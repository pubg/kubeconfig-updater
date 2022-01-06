/* eslint-disable import/prefer-default-export */
import { runInAction } from 'mobx'
import { CredentialResolverKind } from '../../protos/kubeconfig_service_pb'
import { RESOLVER_UNKNOWN, RESOLVER_IMDS, RESOLVER_ENV, RESOLVER_DEFAULT } from './const'
import { ObservedCredResolverConfig } from './type'

// get actual key from config
export function configToResolverKey(config: ObservedCredResolverConfig) {
  switch (config.kind) {
    case CredentialResolverKind.PROFILE: {
      const profile = config.resolverattributesMap.find(([key]) => key === 'profile')
      if (profile && profile.length === 2) {
        return profile[1]
      }
      return RESOLVER_UNKNOWN
    }

    case CredentialResolverKind.IMDS:
      return RESOLVER_IMDS

    case CredentialResolverKind.ENV:
      return RESOLVER_ENV

    case CredentialResolverKind.DEFAULT:
      return RESOLVER_DEFAULT

    default:
      return RESOLVER_UNKNOWN
  }
}

export function getKind(value: string): CredentialResolverKind {
  switch (value) {
    case RESOLVER_DEFAULT:
      return CredentialResolverKind.DEFAULT

    case RESOLVER_ENV:
      return CredentialResolverKind.ENV

    case RESOLVER_IMDS:
      return CredentialResolverKind.IMDS

    default:
      return CredentialResolverKind.PROFILE
  }
}

export function setProfile(config: ObservedCredResolverConfig, profile?: string): void {
  const newKVMapArray = config.resolverattributesMap.filter(([key]) => key !== 'profile')

  if (profile) {
    newKVMapArray.push(['profile', profile])
  }

  runInAction(() => {
    config.resolverattributesMap = newKVMapArray
  })
}

export function updateConfig(
  config: ObservedCredResolverConfig,
  newKind: CredentialResolverKind,
  profile?: string
): void {
  if (newKind !== CredentialResolverKind.PROFILE && !!profile) {
    throw new Error('credentialResolverKind is not PROFILE, but provided profile is not undefined.')
  } else if (newKind === CredentialResolverKind.PROFILE && !profile) {
    throw new Error('credentialResolverKind is PROFILE, but provided profile value is undefined.')
  }

  config.kind = newKind
  setProfile(config, profile)
}
