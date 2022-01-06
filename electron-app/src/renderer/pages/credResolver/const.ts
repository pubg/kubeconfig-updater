import { CredentialResolverKind, CredResolverConfig } from '../../protos/kubeconfig_service_pb'

export const RESOLVER_DEFAULT = '[DEFAULT]'
export const RESOLVER_IMDS = '[IMDS]'
export const RESOLVER_ENV = '[ENV]'
export const RESOLVER_UNKNOWN = '[UNKNOWN]'
export const RESOLVER_PROFILE_FACTORY = (name: string) => `(profile) ${name}`
