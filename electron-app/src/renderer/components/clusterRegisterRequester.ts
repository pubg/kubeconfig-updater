import { flow, makeObservable, observable } from 'mobx'
import React from 'react'
import { container, injectable } from 'tsyringe'
import logger from '../../logger/logger'
import { ResultCode } from '../protos/common_pb'
import RegisterClusterService from '../services/registerClusters'

type RequestType = {
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

  constructor() {
    makeObservable(this)
  }

  request = flow(function* (this: ClusterRegisterRequester, items: RequestType[]) {
    logger.info(`requesting cluster register ${items.length} items`)
    this.length = items.length
    this.processedCount = 0

    this.state = 'processing'

    for (const item of items) {
      try {
        yield (async () => {
          const req = container.resolve(RegisterClusterService)
          const res = await req.request(item.clusterName, item.accountId)

          if (res.getStatus() !== ResultCode.SUCCESS) {
            throw new Error(res.getMessage())
          }
        })()
      } catch (err) {
        logger.error(err)
      }

      this.processedCount += 1
    }

    this.state = 'ready'
    logger.info('finished cluster register request')
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
