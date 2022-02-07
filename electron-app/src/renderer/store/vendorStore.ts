import { computed } from 'mobx'
import { singleton } from 'tsyringe'
import browserLogger from '../logger/browserLogger'

const defaultVendors = ['AWS', 'Azure', 'Tencent']

/**
 * VendorStore provides all available vendors
 * @todo add vendorRepository layer
 */
@singleton()
export default class VendorStore {
  private readonly logger = browserLogger

  @computed
  get vendors(): string[] {
    // TODO: replace mock values to real values from server
    return defaultVendors
  }
}
