import dayjs from 'dayjs'
import { computed, flow, makeObservable, observable, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { ResultCode } from '../protos/common_pb'
import { GetRegisteredProfilesRes, Profile } from '../protos/kubeconfig_service_pb'
import ProfileRepository from '../repositories/profileRepository'
import VendorStore from './vendorStore'

@singleton()
export default class ProfileStore {
  private readonly logger = browserLogger

  @observable
  private _state: 'ready' | 'fetching' = 'ready'

  @computed
  get state() {
    return this._state
  }

  @observable
  private _profiles: Profile.AsObject[] = []

  @computed
  get profiles() {
    return this._profiles
  }

  readonly errorEvent = new EventStore<Error>()

  private lastUpdated = dayjs('1970-01-01')

  private expiredMinute = 5

  constructor(private readonly profileRepository: ProfileRepository, private readonly vendorStore: VendorStore) {
    makeObservable(this)
  }

  fetchProfiles = flow(async function* (this: ProfileStore, forceResync = false) {
    const shouldFetch = forceResync || this.isCacheExpired()
    if (!shouldFetch) {
      this.logger.debug('fetching profiles prevented by cache policy')
      return
    }

    this._state = 'fetching'
    this.logger.debug('fetching profiles...')

    const profiles: Profile.AsObject[][] = yield Promise.all(
      this.vendorStore.vendors.map((vendor) => this.fetchVendorProfile(vendor))
    )

    this._profiles = profiles.flat()
    this.lastUpdated = dayjs()

    this._state = 'ready'
    this.logger.debug(`fetched ${this.profiles.length} profiles: `, toJS(this.profiles))
  })

  private async fetchVendorProfile(vendor: string) {
    const result: GetRegisteredProfilesRes = await this.profileRepository.getProfiles(vendor)
    if (result.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      const statusCode = result.getCommonres()?.getStatus() ?? 'internal error(undefined statusCode)'
      const message = result.getCommonres()?.getStatus() ?? 'internal error(undefined message)'
      this.errorEvent.emit(
        new Error(`failed to fetch profiles of vendor: ${vendor}, statusCode: ${statusCode}, message: ${message}`)
      )
      return []
    }

    return result.getProfilesList().map((profile) => profile.toObject())
  }

  private isCacheExpired() {
    return this.lastUpdated.add(this.expiredMinute, 'minute').isBefore(dayjs())
  }
}
