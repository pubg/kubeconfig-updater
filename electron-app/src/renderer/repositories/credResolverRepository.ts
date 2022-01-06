/* eslint-disable @typescript-eslint/no-explicit-any */
import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { CommonReq, CommonRes } from '../protos/common_pb'
import { CredentialResolverKind, CredResolverConfig, DeleteCredResolverReq } from '../protos/kubeconfig_service_pb'

type Req = Pick<CredResolverConfig.AsObject, 'accountid' | 'infravendor'>

export type OtherCredResolverRegisterReq = Omit<CredentialResolverKind, CredentialResolverKind.PROFILE>

@singleton()
export default class CredResolverRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async SyncAvailableCredResolvers(): Promise<CommonRes> {
    return this.client.syncAvailableCredResolvers(new CommonReq(), null)
  }

  async getCredResolvers() {
    return this.client.getAvailableCredResolvers(new CommonReq(), null)
  }

  // do I have to make this function overload?? WHY???
  async registerCredResolver(accountId: string, infraVendor: string, profile: string): Promise<CommonRes>
  async registerCredResolver(
    accountId: string,
    infraVendor: string,
    type: OtherCredResolverRegisterReq
  ): Promise<CommonRes>
  async registerCredResolver(
    accountId: string,
    infraVendor: string,
    typeOrProfile: string | OtherCredResolverRegisterReq
  ): Promise<CommonRes> {
    const req = new CredResolverConfig()

    req.setAccountid(accountId)
    req.setInfravendor(infraVendor)

    if (typeof typeOrProfile === 'number') {
      const type = typeOrProfile as OtherCredResolverRegisterReq
      req.setKind(type as CredentialResolverKind)
    } else {
      req.setAccountalias(typeOrProfile as string)
      req.setKind(CredentialResolverKind.PROFILE)
    }

    return this.client.setCredResolver(req, null)
  }

  async deleteCredResolver(accountId: string) {
    const req = new DeleteCredResolverReq()
    req.setAccountid(accountId)

    return this.client.deleteCredResolver(req, null)
  }
}
