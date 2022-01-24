/* eslint-disable class-methods-use-this */
import { computed, flow, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'
import LINQ from 'linq'
import CredResolverStore from '../../store/credResolverStore'
import { ProfileSelectionOption } from './configList/profileSelection'
import ProfileStore from '../../store/profileStore'
import { RESOLVER_DEFAULT, RESOLVER_IMDS, RESOLVER_ENV, RESOLVER_PROFILE_FACTORY } from './const'

type Option = ProfileSelectionOption

@singleton()
export default class UIStore {
  @observable
  private _initLoading = true

  @computed
  get state(): 'ready' | 'fetching' {
    return this.profileStore.state !== 'ready' || this._initLoading ? 'fetching' : 'ready'
  }

  @computed
  get defaultOptions(): Option[] {
    return [RESOLVER_DEFAULT, RESOLVER_IMDS, RESOLVER_ENV].map((value) => ({
      key: value,
      label: value,
    }))
  }

  @computed
  get profileOptions(): Option[] {
    return LINQ.from(this.profileStore.profiles)
      .select<Option>((profile) => ({
        key: profile.profilename,
        label: RESOLVER_PROFILE_FACTORY(profile.profilename),
        profile,
      }))
      .orderBy((e) => e.label)
      .toArray()
  }

  /**
   * all possible option values (duplicate removed)
   */
  @computed
  get options(): Option[] {
    return [...this.defaultOptions, ...this.profileOptions]
  }

  constructor(readonly credResolverStore: CredResolverStore, readonly profileStore: ProfileStore) {
    makeObservable(this)
  }

  @flow
  *fetchAll() {
    yield Promise.all([this.fetchCredResolvers(), this.fetchProfiles()])
  }

  // reload local entity state to match backend's state
  @flow
  *fetchCredResolvers() {
    yield this.credResolverStore.fetchCredResolver()
    this._initLoading = false
  }

  @flow
  *fetchProfiles() {
    yield this.profileStore.fetchProfiles()
  }
}
