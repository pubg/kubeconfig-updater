import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetSupportedVendorsRes } from '../protos/kubeconfig_service_pb'
import { getDefaultMetadata } from './grpcMetadata'
import { CommonReq } from '../protos/common_pb'

@singleton()
export default class VendorRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async getVendors(): Promise<GetSupportedVendorsRes> {
    return this.client.getSupportedVendors(new CommonReq(), getDefaultMetadata())
  }
}
