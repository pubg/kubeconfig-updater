import { action, computed, makeAutoObservable, makeObservable, observable } from 'mobx'
import React from 'react'
import { singleton } from 'tsyringe'
import { IObjectWithKey, Selection } from '@fluentui/react'
import { AggregatedClusterMetadata } from '../../protos/kubeconfig_service_pb'

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
}

export namespace ClusterMetadataItem {
  export function fromObject(metadata: AggregatedClusterMetadata): ClusterMetadataItem {
    const data = metadata.toObject() as ClusterMetadata
    return {
      key: data.metadata.clustername,
      data,
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
  // eslint-disable-next-line class-methods-use-this
  get tags(): [string, string][] {
    return []
  }

  @observable
  filter: ClusterMetadataItemFilter | null = null

  setFilter(predicate: ClusterMetadataItemFilter | null) {
    this.filter = predicate
  }

  selection = makeAutoObservable(new Selection<ClusterMetadataItem>(), undefined)

  @computed
  get selectedItems() {
    return this.selection.getSelection()
  }

  @action
  setSelectedItems(selection: Selection<ClusterMetadataItem>) {
    this.selection = selection
  }

  @action
  resetSelection() {
    this.selection = new Selection()
  }
}
