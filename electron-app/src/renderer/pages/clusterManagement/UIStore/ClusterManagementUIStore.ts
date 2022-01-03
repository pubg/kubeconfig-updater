import { action, computed, makeObservable, observable } from 'mobx'
import { Selection } from '@fluentui/react'
import _ from 'lodash'
import LINQ from 'linq'
import { Lifecycle, scoped } from 'tsyringe'
import identity from '../../../utils/identity'
import { ClusterMetadataItem, ClusterMetadataItemFilter } from './types'
import ClusterMetadataStore from '../../../store/clusterMetadataStore'

@scoped(Lifecycle.ContainerScoped)
export default class ClusterManagementUIStore {
  constructor(private readonly clusterMetadataStore: ClusterMetadataStore) {
    makeObservable(this)
  }

  @computed
  get items() {
    return this.clusterMetadataStore.items.map((obj) => ClusterMetadataItem.fromObject(obj))
  }

  @computed
  get tags(): string[] {
    const sortedNewTags = LINQ.from(this.items)
      .selectMany((item) => item.data.metadata.clustertagsMap)
      .select(([key]) => key)
      .distinct()
      .orderBy(identity)
      .toArray()

    return sortedNewTags
  }

  @observable
  private _selectedGroupTag: string | null = null

  get selectedGroupTag() {
    return this._selectedGroupTag
  }

  @action
  setGroupTag(tag: string | null) {
    this._selectedGroupTag = tag
  }

  @observable
  filter: ClusterMetadataItemFilter | null = null

  @action
  setFilter(predicate: ClusterMetadataItemFilter | null) {
    this.filter = predicate
  }

  readonly selectionRef = new Selection<ClusterMetadataItem>({
    onSelectionChanged: () => {
      this.updateSelection()
    },
  })

  @observable
  private _selection = this.selectionRef

  @computed
  get selection(): Selection<ClusterMetadataItem> {
    return this._selection
  }

  @action
  updateSelection(): void {
    // to make mobX knows the value is changed, we make a shallow copy of ref instance
    this._selection = _.clone(this.selectionRef)
  }

  // TODO: should I use this? can I just use instance field?
  @computed
  get selectedItems() {
    return this.selection.getSelection()
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  resetSelection() {
    this.selectionRef.setAllSelected(false)
  }
}
