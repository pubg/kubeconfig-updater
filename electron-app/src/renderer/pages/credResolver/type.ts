import { OBSERVED } from '../../../types/mobx'
import { ResultCode } from '../../protos/common_pb'
import { CredResolverConfig } from '../../protos/kubeconfig_service_pb'

export type ObservedCredResolverConfig = OBSERVED<
  CredResolverConfig.AsObject & {
    setResponse?: {
      resultCode: ResultCode
      message?: string
    }
  }
>
