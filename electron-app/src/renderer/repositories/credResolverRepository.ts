import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { CommonReq, CommonRes } from '../protos/common_pb'

@singleton()
export default class CredResolverRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async SyncAvailableCredResolvers(): Promise<CommonRes> {
    return this.client.syncAvailableCredResolvers(new CommonReq(), null)
  }
}
