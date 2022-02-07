import { flow, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import dayjs, { Dayjs } from 'dayjs'
import { AggregatedClusterMetadata } from '../protos/kubeconfig_service_pb'
import browserLogger from '../logger/browserLogger'
import ClusterRepository from '../repositories/clusterRepository'
import EventStore from '../event/eventStore'
import { ResultCode } from '../protos/common_pb'

@singleton()
export default class ClusterMetadataStore {
  private readonly logger = browserLogger

  @observable
  state: 'ready' | 'fetch' | 'in-sync' = 'ready'

  @observable
  private _items: AggregatedClusterMetadata[] = []

  get items() {
    return this._items
  }

  // minute
  @observable
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

  readonly errorEvent = new EventStore<Error>()

  constructor() {
    makeObservable(this)
  }

  fetchMetadata = flow(function* (this: ClusterMetadataStore, resync?: boolean) {
    this._items = []

    if (resync || this.shouldResync) {
      this.logger.debug('request backend cluster metadata sync')
      this.state = 'in-sync'

      try {
        yield ClusterMetadataStore.sync()
      } catch (e) {
        this.errorEvent.emit(e as Error)
        this.logger.error(e)
      }
    }

    this.logger.debug('request backend cluster metadata fetch')
    this.state = 'fetch'

    try {
      this._items = yield ClusterMetadataStore.fetch()
    } catch (e) {
      this.errorEvent.emit(e as Error)
      this.logger.error(e)
    }

    this.logger.debug('fetch cluster metadata done.')
    this.state = 'ready'
  })

  private static async sync() {
    const repo = container.resolve(ClusterRepository)

    const res = await repo.SyncAvailableClusters()

    if (res.getStatus() !== ResultCode.SUCCESS) {
      const statusCode = res.getStatus()
      const message = res.getMessage()

      throw new Error(`failed sync available clusters, statusCode: ${statusCode} message: ${message}`)
    }

    return res
  }

  private static async fetch() {
    const repository = container.resolve(ClusterRepository)
    const res = await repository.GetAvailableClusters()

    if (res.getCommonres()?.getStatus() !== ResultCode.SUCCESS) {
      const statusCode = res.getCommonres()?.getStatus() ?? 'internal error (statusCode is undefined)'
      const message = res.getCommonres()?.getMessage() ?? 'internal error (message is undefined)'

      throw new Error(`failed fetching available clusters, statusCode: ${statusCode} message: ${message}`)
    }

    return res.getClustersList()
  }
}
