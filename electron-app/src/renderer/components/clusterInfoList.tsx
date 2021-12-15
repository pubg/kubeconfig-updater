import { DetailsList, IDetailsListProps } from '@fluentui/react'
import { Box } from '@mui/material'
import { AggregatedClusterMetadata } from '../protos/kubeconfig_service_pb'

interface ClusterInfoListProps {
  clusterInformations: AggregatedClusterMetadata.AsObject[]
  onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick']
}

export default function ClusterInfoList({
  clusterInformations,
  onHeaderNameClicked,
}: ClusterInfoListProps) {
  return (
    <Box height="100%">
      <DetailsList
        items={clusterInformations}
        onColumnHeaderClick={onHeaderNameClicked}
      />
      {/* <Menu></Menu> */}
    </Box>
  )
}
