import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { DeleteClusterReq, GetAvailableClustersRes, RegisterClusterReq } from '../protos/kubeconfig_service_pb'
import { CommonReq, CommonRes } from '../protos/common_pb'
import { getDefaultMetadata } from './grpcMetadata'
import { createErrorResponse } from './error'

@singleton()
export default class ClusterRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async GetAvailableClusters(): Promise<GetAvailableClustersRes> {
    try {
      return await this.client.getAvailableClusters(new CommonReq(), getDefaultMetadata())
    } catch (e) {
      const res = new GetAvailableClustersRes()
      res.setCommonres(createErrorResponse(e))

      return res
    }
  }

  async RegisterCluster(clusterName: string, accountId: string): Promise<CommonRes> {
    const req = new RegisterClusterReq()

    req.setClustername(clusterName)
    req.setAccountid(accountId)

    try {
      return await this.client.registerCluster(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }

  async SyncAvailableClusters(): Promise<CommonRes> {
    try {
      return await this.client.syncAvailableClusters(new CommonReq(), getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }

  async DeleteCluster(clusterName: string, cascade?: boolean): Promise<CommonRes> {
    try {
      const req = new DeleteClusterReq()
      req.setClustername(clusterName)
      if (cascade !== undefined) {
        req.setCascade(cascade)
      }

      return await this.client.deleteCluster(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }
}
