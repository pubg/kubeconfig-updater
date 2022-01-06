/* eslint-disable import/prefer-default-export */
import { CredResolverConfig, CredentialResolverKind } from '../../protos/kubeconfig_service_pb'
import { RESOLVER_UNKNOWN, RESOLVER_IMDS, RESOLVER_ENV, RESOLVER_DEFAULT } from './const'

// get actual key from config
export function configToResolverKey(config: CredResolverConfig.AsObject) {
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
