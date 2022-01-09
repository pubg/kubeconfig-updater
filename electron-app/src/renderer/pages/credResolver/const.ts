import { CredentialResolverKind } from '../../protos/kubeconfig_service_pb'

export const RESOLVER_DEFAULT = '[DEFAULT]'
export const RESOLVER_IMDS = '[IMDS]'
export const RESOLVER_ENV = '[ENV]'
export const RESOLVER_UNKNOWN = '[UNKNOWN]'
export const RESOLVER_PROFILE_FACTORY = (name: string) => `(profile) ${name}`

export function getType(value?: string): CredentialResolverKind {
  switch (value) {
    case RESOLVER_DEFAULT:
      return CredentialResolverKind.DEFAULT

    case RESOLVER_IMDS:
      return CredentialResolverKind.IMDS

    case RESOLVER_ENV:
      return CredentialResolverKind.ENV

    default:
      return CredentialResolverKind.PROFILE
  }
}
