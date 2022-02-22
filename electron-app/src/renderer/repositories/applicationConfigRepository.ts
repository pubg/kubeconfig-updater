import * as tsyringe from 'tsyringe'
import { ApplicationClient } from '../protos/Kubeconfig_serviceServiceClientPb'
import { GetConfigReq, SetConfigReq } from '../protos/kubeconfig_service_pb'
import { createErrorResponse } from './error'
import { getDefaultMetadata } from './grpcMetadata'

@tsyringe.singleton()
export default class ApplicationConfigRepository {
  constructor(private readonly client: ApplicationClient) {}

  async getConfig(name: string) {
    const req = new GetConfigReq()
    req.setName(name)

    try {
      return await this.client.getConfig(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }

  async setConfig(name: string, data: string) {
    const req = new SetConfigReq()
    req.setName(name)
    req.setData(data)

    try {
      return await this.client.setConfig(req, getDefaultMetadata())
    } catch (e) {
      return createErrorResponse(e)
    }
  }
}
