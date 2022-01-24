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
import { createErrorResponse } from './error'

export type OtherCredResolverRegisterReq = Omit<CredentialResolverKind, CredentialResolverKind.PROFILE>

@singleton()
export default class CredResolverRepository {
  constructor(private readonly client: KubeconfigClient) {}

  async SyncAvailableCredResolvers(): Promise<CommonRes> {
    try {
      return await this.client.syncAvailableCredResolvers(new CommonReq(), getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }

  async getCredResolvers() {
    return this.client.getAvailableCredResolvers(new CommonReq(), getDefaultMetadata())
  }

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

    try {
      return await this.client.setCredResolver(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }

  async deleteCredResolver(accountId: string): Promise<CommonRes> {
    const req = new DeleteCredResolverReq()
    req.setAccountid(accountId)

    try {
      return await this.client.deleteCredResolver(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }
}
