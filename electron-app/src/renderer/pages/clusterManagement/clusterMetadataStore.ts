import { action, computed, makeObservable, observable } from 'mobx'
import React from 'react'
import { IObjectWithKey, Selection } from '@fluentui/react'
import _ from 'lodash'
import LINQ from 'linq'
import { AggregatedClusterMetadata } from '../../protos/kubeconfig_service_pb'
import identity from '../../utils/identity'

export const ClusterMetadataStoreContext = React.createContext<ClusterMetadataStore | null>(null)

export function useStore() {
  const store = React.useContext(ClusterMetadataStoreContext)
  if (!store) {
    throw new Error()
    // throw new Error(`tried to use ${ClusterMetadataStore.name} but context is null.`)
  }

  return store
}

export type ClusterMetadata = AggregatedClusterMetadata.AsObject & {
  metadata: NonNullable<AggregatedClusterMetadata.AsObject['metadata']>
}

export interface ClusterMetadataItem extends IObjectWithKey {
  data: ClusterMetadata
  tags: Map<string, string>
}

export namespace ClusterMetadataItem {
  export function fromObject(metadata: AggregatedClusterMetadata): ClusterMetadataItem {
    const data = metadata.toObject() as ClusterMetadata
    console.log(data.metadata)
    const tags = new Map<string, string>(data.metadata.clustertagsMap)

    return {
      key: data.metadata.clustername,
      data,
      tags,
    }
  }
}

/**
 * predicate of ListItemFilter
 */
export type ClusterMetadataItemFilter = (item: ClusterMetadataItem) => boolean

/**
 * ListItemStore manages cluster metadata list used for UI
 */
export class ClusterMetadataStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  items: ClusterMetadataItem[] = []

  @action
  setItems(items: ClusterMetadataItem[]) {
    this.items = items
    this.resetSelection()
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
  selectedGroupTag: string | null = null

  @action
  setGroupTag(tag: string | null) {
    this.selectedGroupTag = tag
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
