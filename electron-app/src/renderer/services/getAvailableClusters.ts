import { injectable } from 'tsyringe'
import { CommonReq } from '../protos/common_pb'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetAvailableClustersRes } from '../protos/kubeconfig_service_pb'

@injectable()
export default class GetAvailableClusters {
  constructor(private readonly client: KubeconfigClient) {}

  async request(): Promise<GetAvailableClustersRes> {
    return this.client.getAvailableClusters(new CommonReq(), null)
  }
}
