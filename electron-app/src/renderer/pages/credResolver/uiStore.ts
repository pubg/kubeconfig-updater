/* eslint-disable class-methods-use-this */
import { computed, flow, makeObservable, observable } from 'mobx'
import { Lifecycle, scoped } from 'tsyringe'
import LINQ from 'linq'
import CredResolverStore from '../../store/credResolverStore'
import { ProfileSelectionOption } from './configList/profileSelection'
import ProfileStore from '../../store/profileStore'
import { RESOLVER_DEFAULT, RESOLVER_IMDS, RESOLVER_ENV, RESOLVER_PROFILE_FACTORY, RESOLVER_UNKNOWN } from './const'

type Option = ProfileSelectionOption

@scoped(Lifecycle.ContainerScoped)
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

  // reload local entity state to match backend's state
  fetchCredResolvers = flow(function* (this: UIStore, reload = false) {
    yield this.credResolverStore.fetchCredResolver(reload)
    this._initLoading = false
  })

  fetchProfiles = flow(function* (this: UIStore) {
    yield this.profileStore.fetchProfiles()
  })
}
