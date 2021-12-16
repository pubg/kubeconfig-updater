import React from 'react'
import { action, computed, flow, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import { AggregatedClusterMetadata } from '../../protos/kubeconfig_service_pb'
import GetAvailableClusters from '../../services/getAvailableClusters'

export const ClusterMetadataStoreContext =
  React.createContext<ClusterMetadataStore | null>(null)

export const useStore = () => {
  const store = React.useContext(ClusterMetadataStoreContext)
  if (!store) {
    throw new Error(
      'tried to use ClusterMetadataStoreContext but object is null.'
    )
  }

  return store
}

export interface MetadataItem {
  data: AggregatedClusterMetadata.AsObject & {
    metadata: NonNullable<AggregatedClusterMetadata.AsObject['metadata']>
  }
  selected?: boolean
}

export type Filter = (metadata: MetadataItem) => boolean

@singleton()
export class ClusterMetadataStore {
  // TODO: computed decorator for array? consider render/compute optimization
  @observable
  items: MetadataItem[] = []

  @observable
  state: 'fetching' | 'ready' = 'ready'

  @observable
  private _filter: Filter | null = null

  @computed
  get filter(): Filter | null {
    return this._filter
  }

  @action
  setFilter(filter: Filter | null) {
    this._filter = filter
  }

  @computed
  // eslint-disable-next-line class-methods-use-this
  get tags(): string[] {
    // TODO: group 에 사용되는 태그를 보여줌
    return []
  }

  fetchMetadata = flow(function* (this: ClusterMetadataStore) {
    console.log('fetching cluster metadata...')
    this.state = 'fetching'

    const fetch = async () => {
      const req = container.resolve(GetAvailableClusters)
      const res = await req.request()

      return res.getClustersList()
    }

    try {
      const clusterList: AggregatedClusterMetadata[] = yield fetch()
      this.items = clusterList.map((metadata) => ({
        data: metadata.toObject(),
      })) as MetadataItem[]
    } catch (e) {
      console.error(e)
    }

    this.state = 'ready'
  })
}
