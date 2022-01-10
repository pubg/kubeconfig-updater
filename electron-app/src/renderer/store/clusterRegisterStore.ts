import { flow, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import ClusterRepository from '../repositories/clusterRepository'

type Item = {
  clusterName: string
  accountId: string
}

@singleton()
export default class ClusterRegisterStore {
  private readonly logger = browserLogger

  @observable
  private _state: 'ready' | 'processing' = 'ready'

  get state() {
    return this._state
  }

  @observable
  private _length = 0

  get length() {
    return this._length
  }

  @observable
  private _processedCount = 0

  get processedCount() {
    return this._processedCount
  }

  @observable
  private _currentItem: Item | null = null

  get currentItem() {
    return this._currentItem
  }

  readonly errorEvent = new EventStore<Error>()

  constructor() {
    makeObservable(this)
  }

  request = flow(function* (this: ClusterRegisterStore, items: Item[]) {
    this.logger.info(`requesting cluster register ${items.length} items`)
    this._length = items.length
    this._processedCount = 0

    this._state = 'processing'

    for (const item of items) {
      this._currentItem = item

      const res: CommonRes = yield (async () => {
        const repo = container.resolve(ClusterRepository)
        this.logger.debug(
          `requesting cluster registration, clusterName: ${item.clusterName}, accountId: ${item.accountId}`
        )
        return repo.RegisterCluster(item.clusterName, item.accountId)
      })()

      if (res.getStatus() !== ResultCode.SUCCESS) {
        this.logger.debug('failed to register cluster. reason: ', res.getMessage())
        const err = new Error(`registeration failed: ${item.clusterName}, error: ${res.getMessage()}`)
        this.errorEvent.emit(err)
      }

      this._processedCount += 1
    }

    this._currentItem = null
    this._state = 'ready'
    this.logger.info('finished cluster register request')
  })
}
