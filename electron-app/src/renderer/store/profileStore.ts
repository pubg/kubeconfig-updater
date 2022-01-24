import dayjs from 'dayjs'
import { computed, flow, makeObservable, observable, toJS } from 'mobx'
import { singleton } from 'tsyringe'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { ResultCode } from '../protos/common_pb'
import { GetRegisteredProfilesRes, Profile } from '../protos/kubeconfig_service_pb'
import ProfileRepository from '../repositories/profileRepository'

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

  constructor(private readonly profileRepository: ProfileRepository) {
    makeObservable(this)
  }

  fetchProfiles = flow(function* (this: ProfileStore, forceResync = false) {
    const shouldFetch = forceResync || this.isCacheExpired()
    if (!shouldFetch) {
      this.logger.debug('fetching profiles prevented by cache policy')
      return
    }

    this._state = 'fetching'
    this.logger.debug('fetching profiles...')

    const profiles: Profile.AsObject[] = []

    // should I check this error in here? doesn't it belongs to repository layer?
    const awsProfilesResult: GetRegisteredProfilesRes = yield this.profileRepository.getProfiles('AWS')
    if (awsProfilesResult.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      this.errorEvent.emit(new Error(awsProfilesResult.getCommonres()?.getMessage()))
    }

    profiles.push(...awsProfilesResult.getProfilesList().map((profile) => profile.toObject()))

    const azureProfilesResult: GetRegisteredProfilesRes = yield this.profileRepository.getProfiles('Azure')
    if (azureProfilesResult.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      this.errorEvent.emit(new Error(azureProfilesResult.getCommonres()?.getMessage()))
    }

    profiles.push(...azureProfilesResult.getProfilesList().map((profile) => profile.toObject()))

    const tencentProfilesResult: GetRegisteredProfilesRes = yield this.profileRepository.getProfiles('Tencent')
    if (tencentProfilesResult.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      this.errorEvent.emit(new Error(tencentProfilesResult.getCommonres()?.getMessage()))
    }

    profiles.push(...tencentProfilesResult.getProfilesList().map((profile) => profile.toObject()))

    this._profiles = profiles
    this.lastUpdated = dayjs()

    this._state = 'ready'
    this.logger.debug(`fetched ${this.profiles.length} profiles: `, toJS(this.profiles))
  })

  private isCacheExpired() {
    return this.lastUpdated.add(this.expiredMinute, 'minute').isBefore(dayjs())
  }
}
