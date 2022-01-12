import { injectable, singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetAvailableClustersRes, RegisterClusterReq } from '../protos/kubeconfig_service_pb'
import { CommonReq, CommonRes } from '../protos/common_pb'
import { getDefaultMetadata } from './grpcMetadata'

@singleton()
export default class ClusterRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async GetAvailableClusters(): Promise<GetAvailableClustersRes> {
    return this.client.getAvailableClusters(new CommonReq(), getDefaultMetadata())
  }

  async RegisterCluster(clusterName: string, accountId: string): Promise<CommonRes> {
    const req = new RegisterClusterReq()

    req.setClustername(clusterName)
    req.setAccountid(accountId)

    return this.client.registerCluster(req, getDefaultMetadata())
  }

  async SyncAvailableClusters(): Promise<CommonRes> {
    return this.client.syncAvailableClusters(new CommonReq(), getDefaultMetadata())
  }
}
