/* eslint-disable func-names */
import React from 'react'
import { action, computed, flow, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import { AggregatedClusterMetadata } from '../protos/kubeconfig_service_pb'
import GetAvailableClusterService from '../services/getAvailableClusters'

// REFACTOR: this store is trying to be "god class" should break down this
@singleton()
export class ClusterMetadataRequester {
  constructor() {
    makeObservable(this)
  }

  @observable
  state: 'ready' | 'fetching' = 'ready'

  @observable
  items: AggregatedClusterMetadata[] = []

  fetchMetadata = flow(function* (this: ClusterMetadataRequester) {
    this.state = 'fetching'
    this.items = []

    const fetch = async () => {
      const req = container.resolve(GetAvailableClusterService)
      const res = await req.request()

      return res.getClustersList()
    }

    try {
      this.items = yield fetch()
      const clusterList: AggregatedClusterMetadata[] = yield fetch()
    } catch (e) {
      console.error(e)
    }

    this.state = 'ready'
  })
}

export const ClusterMetadataRequesterContext = React.createContext<ClusterMetadataRequester | null>(null)

export const useStore = (): ClusterMetadataRequester => {
  const store = React.useContext(ClusterMetadataRequesterContext)
  if (!store) {
    throw new Error(`tried to use ${ClusterMetadataRequester.name} but object is null.`)
  }

  return store
}
