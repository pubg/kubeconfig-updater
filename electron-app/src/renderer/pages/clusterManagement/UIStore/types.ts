import { IObjectWithKey } from '@fluentui/react'
import { AggregatedClusterMetadata } from '../../../protos/kubeconfig_service_pb'

export type ClusterMetadata = AggregatedClusterMetadata.AsObject & {
  metadata: NonNullable<AggregatedClusterMetadata.AsObject['metadata']>
}

export interface ClusterMetadataItem extends IObjectWithKey {
  data: ClusterMetadata
  tags: Map<string, string>
}

export namespace ClusterMetadataItem {
  export function fromObject(metadata: AggregatedClusterMetadata): ClusterMetadataItem {
    const data = metadata.toObject() as ClusterMetadata

    // normalize text
    data.dataresolversList = data.dataresolversList.map((text) => text.replaceAll('\\', '/'))

    const tags = new Map<string, string>(data.metadata.clustertagsMap)

    return {
      key: data.metadata.clustername,
      data,
      tags,
    }
  }
}

/**
 * predicate of ListItemFilter
 */
export type ClusterMetadataItemFilter = (item: ClusterMetadataItem) => boolean
