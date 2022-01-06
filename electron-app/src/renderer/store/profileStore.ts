import { flow, observable, toJS } from 'mobx'
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

  get state() {
    return this._state
  }

  @observable
  private _profiles: Profile.AsObject[] = []

  get profiles() {
    return this._profiles
  }

  readonly errorEvent = new EventStore<Error>()

  constructor(private readonly profileRepository: ProfileRepository) {}

  fetchProfiles = flow(function* (this: ProfileStore) {
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

    this._state = 'ready'
    this.logger.debug(`fetched ${this.profiles.length} profiles: `, toJS(this.profiles))
  })
}
