import { injectable, singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetAvailableClustersRes, RegisterClusterReq } from '../protos/kubeconfig_service_pb'
import { CommonReq } from '../protos/common_pb'

@singleton()
export default class ClusterRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async GetAvailableClusters(): Promise<GetAvailableClustersRes> {
    return this.client.getAvailableClusters(new CommonReq(), null)
  }

  async RegisterCluster(clusterName: string, accountId: string) {
    const req = new RegisterClusterReq()

    req.setClustername(clusterName)
    req.setAccountid(accountId)

    await this.client.registerCluster(req, null)
  }

  async SyncAvailableClusters() {
    await this.client.syncAvailableClusters(new CommonReq(), null)
  }
}
