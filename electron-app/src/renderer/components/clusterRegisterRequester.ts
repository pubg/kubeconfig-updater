import { flow, makeObservable, observable } from 'mobx'
import React from 'react'
import { container, injectable } from 'tsyringe'
import browserLogger from '../logger/browserLogger'
import { CommonRes, ResultCode } from '../protos/common_pb'
import RegisterClusterService from '../services/registerClusters'
import EventStore from '../store/eventStore'

type Item = {
  clusterName: string
  accountId: string
}

/**
 * manages Cluster Register Request to backend
 */
@injectable()
export class ClusterRegisterRequester {
  @observable
  state: 'ready' | 'processing' = 'ready'

  @observable
  length = 0

  @observable
  processedCount = 0

  @observable
  currentItem: Item | null = null

  @observable
  error: Error | null = null

  constructor() {
    makeObservable(this)
  }

  request = flow(function* (this: ClusterRegisterRequester, items: Item[]) {
    browserLogger.info(`requesting cluster register ${items.length} items`)
    this.length = items.length
    this.processedCount = 0

    this.state = 'processing'

    for (const item of items) {
      const res: CommonRes = yield (async () => {
        const req = container.resolve(RegisterClusterService)
        browserLogger.debug(
          `requesting cluster registration, clusterName: ${item.clusterName}, accountId: ${item.accountId}`
        )
        this.currentItem = item
        return req.request(item.clusterName, item.accountId)
      })()

      if (res.getStatus() !== ResultCode.SUCCESS) {
        browserLogger.debug('failed to register cluster.')
        this.error = new Error(`registeration failed: ${item.clusterName}`)
      }

      this.processedCount += 1
    }

    this.currentItem = null
    this.state = 'ready'
    browserLogger.info('finished cluster register request')
  })
}

export const ClusterRegisterRequesterContext = React.createContext<ClusterRegisterRequester | null>(null)

export const useContext = (): ClusterRegisterRequester => {
  const store = React.useContext(ClusterRegisterRequesterContext)
  if (!store) {
    throw new Error('tried to use ClusterRegisterRequester but object is null')
  }

  return store
}
