import { injectable } from 'tsyringe'
import { CommonReq } from '../protos/common_pb'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'

@injectable()
export default class SyncAvailableClustersService {
  constructor(private readonly client: KubeconfigClient) {}

  async request() {
    return this.client.syncAvailableClusters(new CommonReq(), null)
  }
}
