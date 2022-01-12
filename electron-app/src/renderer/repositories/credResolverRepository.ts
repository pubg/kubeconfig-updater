/* eslint-disable @typescript-eslint/no-explicit-any */
import { singleton } from 'tsyringe'
import { KubeconfigClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { CommonReq, CommonRes } from '../protos/common_pb'
import {
  CredentialResolverKind,
  CredentialResolverStatus,
  CredResolverConfig,
  DeleteCredResolverReq,
} from '../protos/kubeconfig_service_pb'
import { getDefaultMetadata } from './grpcMetadata'

type Req = Pick<CredResolverConfig.AsObject, 'accountid' | 'infravendor'>

export type OtherCredResolverRegisterReq = Omit<CredentialResolverKind, CredentialResolverKind.PROFILE>

@singleton()
export default class CredResolverRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async SyncAvailableCredResolvers(): Promise<CommonRes> {
    return this.client.syncAvailableCredResolvers(new CommonReq(), getDefaultMetadata())
  }

  async getCredResolvers() {
    return this.client.getAvailableCredResolvers(new CommonReq(), getDefaultMetadata())
  }

  // do I have to make this function overload?? WHY???
  async setCredResolver(config: CredResolverConfig.AsObject): Promise<CommonRes> {
    const req = new CredResolverConfig()

    req.setAccountid(config.accountid)
    req.setInfravendor(config.infravendor)
    req.setAccountalias(config.accountalias)
    req.setKind(config.kind)

    // NOTE: currently it needs to be set on renderer (it will be fixed later)
    req.setStatus(CredentialResolverStatus.CRED_REGISTERED_OK)

    const resolverAttrMap = req.getResolverattributesMap()

    for (const [key, value] of config.resolverattributesMap) {
      resolverAttrMap.set(key, value)
    }

    return this.client.setCredResolver(req, null)
  }

  async deleteCredResolver(accountId: string) {
    const req = new DeleteCredResolverReq()
    req.setAccountid(accountId)

    return this.client.deleteCredResolver(req, null)
  }
}
