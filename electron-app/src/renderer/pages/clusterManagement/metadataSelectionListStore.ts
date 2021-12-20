import { action, computed, makeAutoObservable, makeObservable, observable } from 'mobx'
import React from 'react'
import { injectable } from 'tsyringe'
import { IObjectWithKey, Selection } from '@fluentui/react'
import { AggregatedClusterMetadata } from '../../protos/kubeconfig_service_pb'

type ClusterMetadata = AggregatedClusterMetadata.AsObject & {
  metadata: NonNullable<AggregatedClusterMetadata.AsObject['metadata']>
}

interface MetadataItem extends IObjectWithKey {
  data: ClusterMetadata
}

/**
 * predicate of ListItemFilter
 */
export type MetadataItemFilter = (item: MetadataItem) => boolean

/**
 * ListItemStore manages cluster metadata list used for UI
 */
@injectable()
export class MetadataSelectionListStore {
  constructor() {
    makeObservable(this)
  }

  @observable
  items: MetadataItem[] = []

  setItems(items: MetadataItem[]) {
    this.items = items
    this.resetSelection()
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get tags(): [string, string][] {
    return []
  }

  @observable
  filter: MetadataItemFilter | null = null

  setFilter(predicate: MetadataItemFilter | null) {
    this.filter = predicate
  }

  selection = makeAutoObservable(new Selection<MetadataItem>(), undefined, { deep: true })

  @computed
  get selectedItems() {
    return this.selection.getSelection()
  }

  @action
  setSelectedItems(selection: Selection<MetadataItem>) {
    this.selection = selection
  }

  @action
  resetSelection() {
    this.selection = new Selection()
  }
}

export const ListItemStoreContext = React.createContext<MetadataSelectionListStore | null>(null)

export const useStore = () => {
  const store = React.useContext(ListItemStoreContext)
  if (!store) {
    throw new Error(`tried to use ${MetadataSelectionListStore.name} but context is null.`)
  }

  return store
}
