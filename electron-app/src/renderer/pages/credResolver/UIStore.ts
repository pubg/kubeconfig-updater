/* eslint-disable class-methods-use-this */
import { computed, flow, makeObservable, observable } from 'mobx'
import { Lifecycle, scoped } from 'tsyringe'
import LINQ from 'linq'
import { CredentialsSelectionProps } from '../../components/credentialsSelection'
import CredResolverStore from '../../store/credResolverStore'
import ProfileStore from '../../store/profileStore'
import { RESOLVER_DEFAULT, RESOLVER_IMDS, RESOLVER_ENV, RESOLVER_PROFILE_FACTORY } from './const'

type Option = CredentialsSelectionProps['options'][number]

@scoped(Lifecycle.ContainerScoped)
export default class UIStore {
  @observable
  private _loadCounter: number = 0

  @computed
  get state(): 'ready' | 'fetching' {
    return this._loadCounter > 0 ? 'fetching' : 'ready'
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
      .select<Option>(({ profilename }) => ({ key: profilename, label: RESOLVER_PROFILE_FACTORY(profilename) }))
      .toArray()
  }

  @computed
  get configOptions(): Option[] {
    return LINQ.from(this.credResolverStore.credResolvers)
      .selectMany((config) => config.resolverattributesMap)
      .where(([key]) => key === 'profile')
      .select(([_, value]) => value)
      .distinct()
      .select<Option>((profile) => ({
        key: profile,
        label: RESOLVER_PROFILE_FACTORY(profile),
      }))
      .toArray()
  }

  /**
   * all possible option values (duplicate removed)
   */
  @computed
  get options(): Option[] {
    // remove duplicates
    const map = new Map<string, Option>()

    for (const option of [...this.defaultOptions, ...this.profileOptions, ...this.configOptions]) {
      map.set(option.key, option)
    }

    return [...map.values()]
  }

  constructor(readonly credResolverStore: CredResolverStore, readonly profileStore: ProfileStore) {
    makeObservable(this)
  }

  // reload local entity state to match backend's state
  fetchCredResolvers = flow(function* (this: UIStore) {
    this._loadCounter += 1
    yield this.credResolverStore.fetchCredResolver()
    this._loadCounter -= 1
  })

  fetchProfiles = flow(function* (this: UIStore) {
    this._loadCounter += 1
    yield this.profileStore.fetchProfiles()
    this._loadCounter -= 1
  })
}
