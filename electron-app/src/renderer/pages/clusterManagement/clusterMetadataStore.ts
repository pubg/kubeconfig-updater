/* eslint-disable func-names */
import React from 'react'
import { action, computed, flow, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import _ from 'lodash'
import { ResultCode } from '../../protos/common_pb'
import { AggregatedClusterMetadata } from '../../protos/kubeconfig_service_pb'
import GetAvailableClusterService from '../../services/getAvailableClusters'
import RegisterClusterService from '../../services/registerClusters'
import logger from '../../../logger/logger'

export const ClusterMetadataStoreContext = React.createContext<ClusterMetadataStore | null>(null)

export const useStore = (): ClusterMetadataStore => {
  const store = React.useContext(ClusterMetadataStoreContext)
  if (!store) {
    throw new Error('tried to use ClusterMetadataStoreContext but object is null.')
  }

  return store
}

export interface MetadataItem {
  data: AggregatedClusterMetadata.AsObject & {
    metadata: NonNullable<AggregatedClusterMetadata.AsObject['metadata']>
  }
  /** @deprecated unused */
  selected?: boolean
}

export type Filter = (metadata: MetadataItem) => boolean

// REFACTOR: this store is trying to be "god class" should break down this
@singleton()
export class ClusterMetadataStore {
  constructor() {
    makeObservable(this)
  }

  // TODO: computed decorator for array? consider render/compute optimization
  @observable
  items: MetadataItem[] = []

  @observable
  state: 'fetching' | 'ready' = 'ready'

  @observable
  filter: Filter | null = null

  @action
  setFilter(filter: Filter | null) {
    this.filter = filter
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get tags(): string[] {
    // TODO: group 에 사용되는 태그를 보여줌
    return []
  }

  @observable
  selectedItems: MetadataItem[] = []

  @action
  setSelectedItems(items: MetadataItem[]) {
    this.selectedItems = items
  }

  fetchMetadata = flow(function* (this: ClusterMetadataStore) {
    this.state = 'fetching'
    this.items = []

    const fetch = async () => {
      const req = container.resolve(GetAvailableClusterService)
      const res = await req.request()

      return res.getClustersList()
    }

    try {
      const clusterList: AggregatedClusterMetadata[] = yield fetch()

      this.items = clusterList.map((metadata) => ({
        data: metadata.toObject(),
      })) as MetadataItem[]
    } catch (e) {
      logger.error(e)
    }

    this.state = 'ready'
  })
}
