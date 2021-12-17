import { injectable } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { RegisterClusterReq } from '../protos/kubeconfig_service_pb'

@injectable()
export default class RegisterClusterService {
  constructor(private readonly client: KubeconfigClient) {}

  async request(clusterName: string, accountId: string) {
    const req = new RegisterClusterReq()

    req.setClustername(clusterName)
    req.setAccountid(accountId)

    return this.client.registerCluster(req, null)
  }
}
