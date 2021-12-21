/* eslint-disable func-names */
import React from 'react'
import { flow, makeObservable, observable } from 'mobx'
import { container, injectable } from 'tsyringe'
import dayjs, { Dayjs } from 'dayjs'
import { AggregatedClusterMetadata } from '../protos/kubeconfig_service_pb'
import GetAvailableClusterService from '../services/getAvailableClusters'
import SyncAvailableClustersService from '../services/syncAvailableClusters'
import logger from '../../logger/logger'

/**
 * manages cluster metadata requesting
 */
@injectable()
export class ClusterMetadataRequester {
  constructor() {
    makeObservable(this)
  }

  @observable
  state: 'ready' | 'fetch' | 'in-sync' = 'ready'

  @observable
  items: AggregatedClusterMetadata[] = []

  @observable
  // minute
  ResyncInterval = 5

  private readonly syncedString = 'lastSynced'

  @observable
  private _lastSynced: Dayjs | null = dayjs(localStorage.getItem(this.syncedString))

  get lastSynced(): Dayjs | null {
    return this._lastSynced
  }

  set lastSynced(time: Dayjs | null) {
    this._lastSynced = time
    localStorage.setItem(this.syncedString, (time ?? dayjs('1970-01-01')).toISOString())
  }

  get shouldResync(): boolean {
    if (this.lastSynced === null) {
      return true
    }

    if (dayjs().diff(this.lastSynced, 'minute') >= this.ResyncInterval) {
      return true
    }

    return false
  }

  fetchMetadata = flow(function* (this: ClusterMetadataRequester, resync?: boolean) {
    this.items = []

    if (resync || this.shouldResync) {
      logger.debug('request backend cluster metadata sync')
      this.state = 'in-sync'

      try {
        yield ClusterMetadataRequester.sync()
      } catch (e) {
        logger.error(e)
      }
    }

    logger.debug('request backend cluster metadata fetch')
    this.state = 'fetch'

    try {
      this.items = yield ClusterMetadataRequester.fetch()
    } catch (e) {
      // TODO: replace this to winston logger
      logger.error(e)
    }

    this.state = 'ready'
  })

  private static async sync() {
    const req = container.resolve(SyncAvailableClustersService)
    // TODO: does this throw error or do I have to use error handling with returned value?
    // does it even need try/catch? need to read doc first...
    return req.request()
  }

  private static async fetch() {
    const req = container.resolve(GetAvailableClusterService)
    const res = await req.request()

    return res.getClustersList()
  }
}

export const ClusterMetadataRequesterContext = React.createContext<ClusterMetadataRequester | null>(null)

export const useContext = (): ClusterMetadataRequester => {
  const store = React.useContext(ClusterMetadataRequesterContext)
  if (!store) {
    throw new Error(`tried to use ${ClusterMetadataRequester.name} but object is null.`)
  }

  return store
}
