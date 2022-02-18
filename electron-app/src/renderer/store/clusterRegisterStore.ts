import { computed, flow, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'
import { OBSERVED } from '../../types/mobx'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import ClusterRepository from '../repositories/clusterRepository'
import { CancellationToken, CancellationTokenSource } from '../types/cancellationToken'
import { PayloadMap, ValueWithPayload } from '../types/payloadMap'

type Item = {
  clusterName: string
  accountId: string
}

type Payload = OBSERVED<{
  resolved?: boolean
  response?: {
    resultCode: ResultCode
    message: string
  }
}>

function keySelector(item: Item): string {
  return `${item.accountId}#${item.clusterName}`
}

/**
 * @todo refactor to remove type Mode if alias count increase
 */
type Mode = 'register' | 'unregister'

@singleton()
export default class ClusterRegisterStore {
  private readonly logger = browserLogger

  @observable
  private _state: 'ready' | 'processing' = 'ready'

  private readonly _registerMap = new PayloadMap<Item, Payload>(keySelector)

  get state() {
    return this._state
  }

  @computed
  get items() {
    return this._registerMap.values()
  }

  @computed
  get length(): number {
    return this._registerMap.size
  }

  @computed
  get processedCount(): number {
    const values = [...this._registerMap.values()]
    const { length } = values.filter(({ payload }) => payload?.resolved)

    return length
  }

  private _cancelSource = new CancellationTokenSource()

  get isRequestCanceled() {
    return this._cancelSource.isCancelRequested
  }

  readonly errorEvent = new EventStore<Error>()

  constructor(private readonly clusterRepository: ClusterRepository) {
    makeObservable(this)
  }

  cancelRequest() {
    this._cancelSource.cancel()
  }

  request = flow(function* (this: ClusterRegisterStore, items: Item[], mode: Mode = 'register') {
    this._cancelSource = new CancellationTokenSource()
    const cancelToken = this._cancelSource.token

    this.logger.info(`requesting cluster register ${items.length} items`)

    this._state = 'processing'

    this._registerMap.clear()
    this._registerMap.update(items)

    // backend allows parallelRun but we're still using blocking request
    // because we cannot cancel during parallelRun
    const parallelRun = false

    if (parallelRun) {
      yield this.requestParallel(cancelToken, mode)
    } else {
      yield this.requestSync(cancelToken, mode)
    }

    this._state = 'ready'
    this.logger.info(`finished cluster ${mode} request`)
  })

  private async requestParallel(cancelToken: CancellationToken, mode: Mode) {
    const promises = [...this._registerMap.values()].map((p) => this.requestInternal(p, cancelToken, mode))

    await Promise.all(promises)
  }

  private async requestSync(cancelToken: CancellationToken, mode: Mode) {
    for (const [, itemWithPayload] of this._registerMap) {
      // eslint-disable-next-line no-await-in-loop
      await this.requestInternal(itemWithPayload, cancelToken, mode)
    }
  }

  @flow
  private *requestInternal(
    itemWithPayload: ValueWithPayload<Item, Payload>,
    cancelToken: CancellationToken,
    mode: Mode
  ) {
    const { accountId, clusterName } = itemWithPayload.value
    itemWithPayload.payload = observable({ resolved: false }) as Payload

    this.logger.info(`request cluster ${mode}, clusterName: ${clusterName}, accountId: ${accountId}`)

    if (cancelToken.canceled) {
      itemWithPayload.payload.resolved = true
      itemWithPayload.payload.response = {
        resultCode: ResultCode.CANCELED,
        message: 'request canceled by client',
      }
      return itemWithPayload
    }

    const response: CommonRes =
      mode === 'register'
        ? yield this.clusterRepository.RegisterCluster(clusterName, accountId)
        : yield this.clusterRepository.DeleteCluster(clusterName)

    itemWithPayload.payload.resolved = true
    itemWithPayload.payload.response = {
      resultCode: response.getStatus(),
      message: response.getMessage(),
    }

    if (itemWithPayload.payload.response.resultCode !== ResultCode.SUCCESS) {
      const errorMessage = `failed to ${mode} cluster account: ${accountId}, clusterName: ${clusterName}, reason: ${itemWithPayload.payload.response.message}`

      this.logger.error(errorMessage)
      this.errorEvent.emit(new Error(errorMessage))
    } else {
      this.logger.info(`${mode} complete. clusterName: ${clusterName}, accountId: ${accountId}`)
    }

    return itemWithPayload
  }
}
