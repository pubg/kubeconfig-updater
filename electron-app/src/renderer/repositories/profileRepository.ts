import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetRegisteredProfilesReq, GetRegisteredProfilesRes } from '../protos/kubeconfig_service_pb'
import { createErrorResponse } from './error'
import { getDefaultMetadata } from './grpcMetadata'

@singleton()
export default class ProfileRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async getProfiles(vendor: string): Promise<GetRegisteredProfilesRes> {
    const req = new GetRegisteredProfilesReq()
    req.setInfravendor(vendor)

    try {
      return await this.client.getRegisteredProfiles(req, getDefaultMetadata())
    } catch (e) {
      const res = new GetRegisteredProfilesRes()
      res.setCommonres(createErrorResponse(e))

      return res
    }
  }
}
