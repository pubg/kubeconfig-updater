import { IColumn } from '@fluentui/react'
import { Typography } from '@mui/material'
import { ClusterInformationStatus } from '../../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from '../UIStore/types'

function columnBase() {
  return {
    minWidth: 0,
    isResizable: true,
  }
}

const clusterNameColumn: IColumn = {
  ...columnBase(),
  key: 'clusterName',
  name: 'Cluster Name',
  onRender: (item: ClusterMetadataItem) => {
    return <Typography>{item.data.metadata.clustername}</Typography>
  },
}

const statusColumn: IColumn = {
  ...columnBase(),
  minWidth: 128,
  key: 'status',
  name: 'Status',
  onRender(item: ClusterMetadataItem) {
    switch (item.data.status) {
      case ClusterInformationStatus.REGISTERED_OK:
        return <Typography>Registered</Typography>

      case ClusterInformationStatus.SUGGESTION_OK:
        return <Typography>Not Registered</Typography>

      case ClusterInformationStatus.REGISTERED_UNKNOWN:
        return <Typography>Unknown</Typography>

      default:
        return <Typography>Error</Typography>
    }
  },
}

type ColumnType = IColumn & { key: string; name: string }

export default function columnsFactory(additionalColumns: ColumnType[]): IColumn[] {
  const columns = additionalColumns.map<IColumn>(({ key, name }) => ({
    ...columnBase(),
    key,
    name,
    isResizable: true,
  }))

  return [clusterNameColumn, ...columns, statusColumn]
}
