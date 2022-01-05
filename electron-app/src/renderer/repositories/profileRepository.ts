import { singleton } from 'tsyringe'
import { ResultCode } from '../protos/common_pb'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetRegisteredProfilesReq } from '../protos/kubeconfig_service_pb'

// check backend/pkg/types/enums.go _InfraVendorNames
type VendorNames = 'AWS' | 'Azure' | 'Tencent'

@singleton()
export default class ProfileRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async getProfiles(vendor: VendorNames) {
    const req = new GetRegisteredProfilesReq()
    req.setInfravendor(vendor)

    return this.client.getRegisteredProfiles(req, null)
  }
}
