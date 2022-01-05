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

  async registerCredResolver(metadata: Req, accountAlias: string): Promise<CommonRes>
  async registerCredResolver(metadata: Req, type: OtherCredResolverRegisterReq): Promise<CommonRes>
  async registerCredResolver(metadata: Req, params: string | OtherCredResolverRegisterReq): Promise<CommonRes> {
    const req = new CredResolverConfig()

    req.setAccountid(metadata.accountid)
    req.setInfravendor(metadata.infravendor)

    if (typeof params === 'number') {
      const type = params as OtherCredResolverRegisterReq
      req.setKind(type as CredentialResolverKind)
    } else {
      req.setAccountalias(params as string)
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
