import { computed, flow, makeObservable, observable } from 'mobx'
import { Lifecycle, scoped } from 'tsyringe'
import CredResolverStore from '../../store/credResolverStore'
import CredResolverConfigEntity from './CredResolverConfigEntity'

@scoped(Lifecycle.ContainerScoped)
export default class UIStore {
  @observable
  private _state: 'ready' | 'fetching' = 'ready'

  get state() {
    return this._state
  }

  // does it updated after @observable state changed?
  @computed
  get configEntites(): CredResolverConfigEntity[] {
    return this.configStore.credResolvers.map((config) => new CredResolverConfigEntity(config))
  }

  constructor(private readonly configStore: CredResolverStore) {
    makeObservable(this)
  }

  // reload local entity state to match backend's state
  fetch = flow(function* (this: UIStore) {
    this._state = 'fetching'
    yield this.configStore.fetchCredResolver()
    this._state = 'ready'
  })
}
