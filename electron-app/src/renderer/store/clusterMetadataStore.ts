import { computed, flow, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import dayjs, { Dayjs } from 'dayjs'
import { AggregatedClusterMetadata } from '../protos/kubeconfig_service_pb'
import browserLogger from '../logger/browserLogger'
import ClusterRepository from '../repositories/clusterRepository'
import EventStore from '../event/eventStore'
import { ResultCode } from '../protos/common_pb'
import CredResolverStore from './credResolverStore'
import { Disposable } from '../types/disposable'

@singleton()
export default class ClusterMetadataStore implements Disposable {
  private readonly disposables: Disposable[] = []

  private disposed = false

  private readonly logger = browserLogger

  @observable
  private _state: 'ready' | 'fetch' | 'in-sync' = 'ready'

  @computed
  get state() {
    return this._state
  }

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

  constructor(credResolverStore: CredResolverStore) {
    makeObservable(this)

    credResolverStore.event.on('credResolverUpdated', (sender, e) => this.onCredResolverUpdated(sender, e))

    this.fetchMetadata()
  }

  private onCredResolverUpdated(_: any, e: any) {
    this.fetchMetadata(true)
  }

  /**
   * fetchMetadata get cluster metadata from backend.
   * @param doSync determines whether or not to sync before fetching data from backend.
   */
  fetchMetadata = flow(function* (this: ClusterMetadataStore, doSync = true) {
    this._items = []

    if (doSync || this.shouldResync) {
      this.logger.debug('request backend cluster metadata sync')
      this._state = 'in-sync'

      try {
        yield ClusterMetadataStore.sync()
      } catch (e) {
        this.errorEvent.emit(e as Error)
        this.logger.error(e)
      }
    }

    this.logger.debug('request backend cluster metadata fetch')
    this._state = 'fetch'

    try {
      this._items = yield ClusterMetadataStore.fetch()
    } catch (e) {
      this.errorEvent.emit(e as Error)
      this.logger.error(e)
    }

    this.logger.debug('fetch cluster metadata done.')
    this._state = 'ready'
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
      const statusCode = res.getCommonres()?.getStatus() ?? 'internal error (undefined statusCode)'
      const message = res.getCommonres()?.getMessage() ?? 'internal error (undefined statusCode)'

      throw new Error(`failed fetching available clusters, statusCode: ${statusCode} message: ${message}`)
    }

    return res.getClustersList()
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    for (const disposable of this.disposables) {
      disposable.dispose()
    }

    this.disposed = true
  }
}
