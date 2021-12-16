import { DetailsList, IDetailsListProps } from '@fluentui/react'
import { Box } from '@mui/material'
import { MetadataItem } from '../pages/clusterManagement/clusterMetadataStore'

interface ClusterInfoListProps {
  clusterInformations: MetadataItem[]
  onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick']
}

export default function ClusterInfoList({
  clusterInformations,
  onHeaderNameClicked,
}: ClusterInfoListProps) {
  return (
    <Box height="100%">
      <DetailsList
        items={clusterInformations.map((item) => ({
          name: item.data.metadata.clustername,
        }))}
        onColumnHeaderClick={onHeaderNameClicked}
      />
      {/* <Menu></Menu> */}
    </Box>
  )
}
