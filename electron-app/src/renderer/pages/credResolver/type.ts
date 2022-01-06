import { OBSERVED } from '../../../types/mobx'
import { CredResolverConfig } from '../../protos/kubeconfig_service_pb'

export type ObservedCredResolverConfig = OBSERVED<CredResolverConfig.AsObject>
