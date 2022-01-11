import { computed, flow, makeAutoObservable, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'
import { OBSERVED } from '../../types/mobx'
import EventStore from '../event/eventStore'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import ClusterRepository from '../repositories/clusterRepository'
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

@singleton()
export default class ClusterRegisterStore {
  private readonly logger = browserLogger

  @observable
  private _state: 'ready' | 'processing' = 'ready'

  @observable
  private _registerMap = new PayloadMap<Item, Payload>(keySelector)

  get state() {
    return this._state
  }

  @computed
  get length() {
    return this._registerMap.size
  }

  @computed
  get processedCount() {
    return [...this._registerMap.values()].filter(({ payload }) => payload?.resolved)
  }

  readonly errorEvent = new EventStore<Error>()

  constructor(private readonly clusterRepository: ClusterRepository) {
    makeObservable(this)
  }

  request = flow(function* (this: ClusterRegisterStore, items: Item[]) {
    this.logger.info(`requesting cluster register ${items.length} items`)

    this._state = 'processing'

    this._registerMap.clear()
    this._registerMap.update(items)

    // TODO: parallel computation?
    // const promises: Promise<void>[] = []

    for (const [, itemWithPayload] of this._registerMap) {
      yield this.requestRegister(itemWithPayload)
    }

    this._state = 'ready'
    this.logger.info('finished cluster register request')
  })

  private async requestRegister(
    itemWithPayload: ValueWithPayload<Item, Payload>
  ): Promise<ValueWithPayload<Item, Payload>> {
    const { accountId, clusterName } = itemWithPayload.value
    itemWithPayload.payload = makeAutoObservable({ resolved: false })

    this.logger.info(`request cluster register, clusterName: ${clusterName}, accountId: ${accountId}`)

    const response = await this.clusterRepository.RegisterCluster(clusterName, accountId)

    itemWithPayload.payload.response = {
      resultCode: response.getStatus(),
      message: response.getMessage(),
    }

    if (itemWithPayload.payload.response.resultCode !== ResultCode.SUCCESS) {
      const errorMessage = `failed to register cluster account: ${accountId}, clusterName: ${clusterName}, reason: ${itemWithPayload.payload.response.message}`

      this.logger.error(errorMessage)
      this.errorEvent.emit(new Error(errorMessage))
    } else {
      this.logger.info(`register complete. clusterName: ${clusterName}, accountId: ${accountId}`)
    }

    return itemWithPayload
  }
}
