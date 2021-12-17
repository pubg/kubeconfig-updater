/* eslint-disable class-methods-use-this */
import { generateMockClusterInfos } from '../../models/clusterInfo/mockClusterInfo'
import { AggregatedClusterMetadata, ClusterMetadata, GetAvailableClustersRes } from '../../protos/kubeconfig_service_pb'
import sleep from '../../utils/sleep'

export default class MockKubeconfigClient {
  async getAvailableClusters(): Promise<GetAvailableClustersRes> {
    const mockResponse = new GetAvailableClustersRes()

    const items = generateMockClusterInfos(64)

    for (const item of items) {
      const aggregatedMetadata = new AggregatedClusterMetadata()
      const metadata = new ClusterMetadata()

      metadata.setClustername(item.metadata!.clustername)
      metadata.setCredresolverid(item.metadata!.credresolverid)
      aggregatedMetadata.setMetadata(metadata)
      aggregatedMetadata.setStatus(item.status)

      mockResponse.addClusters(aggregatedMetadata)
    }

    await sleep(2000)

    return mockResponse
  }
}
