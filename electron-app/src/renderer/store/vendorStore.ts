import { computed, flow, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import VendorRepository from '../repositories/vendorRepository'
import { ResultCode } from '../protos/common_pb'
import { GetSupportedVendorsRes } from '../protos/kubeconfig_service_pb'

/**
 * VendorStore provides all available vendors
 */
@singleton()
export default class VendorStore {
  private readonly logger = browserLogger

  @observable
  private _vendors: string[] = []

  constructor(private readonly vendorRepository: VendorRepository) {
    makeObservable(this)
  }

  @computed
  get vendors(): string[] {
    return this._vendors
  }

  @flow.bound
  *fetchVendors() {
    const res: GetSupportedVendorsRes = yield this.vendorRepository.getVendors()

    if (res.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      const statusCode = res.getCommonres()?.getStatus() ?? 'internal error (undefined statusCode)'
      const message = res.getCommonres()?.getMessage() ?? 'internal error (undefined statusCode)'

      throw new Error(`failed fetching available clusters, statusCode: ${statusCode} message: ${message}`)
    }

    this._vendors = res.getVendorsList().map((v) => v.getVendorname())
  }
}
