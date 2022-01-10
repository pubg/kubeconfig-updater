import { IColumn } from '@fluentui/react'
import { Typography } from '@mui/material'
import { ClusterInformationStatus } from '../../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from '../UIStore/types'

function columnBase(): Partial<IColumn> & { minWidth: number } {
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

const statusMap: Map<ClusterInformationStatus, string> = new Map(
  Object.entries(ClusterInformationStatus).map<[ClusterInformationStatus, string]>(([k, v]) => [
    v as ClusterInformationStatus,
    k as string,
  ])
)

const statusColumn: IColumn = {
  ...columnBase(),
  minWidth: 180,
  key: 'status',
  name: 'Status',
  onRender(item: ClusterMetadataItem) {
    const statusString = statusMap.get(item.data.status)
    switch (item.data.status) {
      case ClusterInformationStatus.REGISTERED_OK:
        return <Typography>Registered</Typography>

      case ClusterInformationStatus.SUGGESTION_OK:
        return <Typography>Not Registered</Typography>

      case ClusterInformationStatus.REGISTERED_NOTOK_CRED_RES_NOTOK:
        return <Typography>(Registered) Credential Resolver invalid</Typography>

      case ClusterInformationStatus.SUGGESTION_NOTOK_CRED_RES_NOTOK:
        return <Typography>(Suggested) Credential Resolver invalid</Typography>

      case ClusterInformationStatus.REGISTERED_NOTOK_NO_CRED_RESOLVER:
        return <Typography>(Registered) Credential Resolver not set</Typography>

      case ClusterInformationStatus.SUGGESTION_NOTOK_NO_CRED_RESOLVER:
        return <Typography>(Suggested) Credential Resolver not set</Typography>

      case ClusterInformationStatus.REGISTERED_UNKNOWN:
        return <Typography>Unknown</Typography>

      default:
        return <Typography>{statusString}</Typography>
    }
  },
}

type ColumnType = IColumn & { key: string; name: string }

export default function columnsFactory(additionalColumns: ColumnType[]): IColumn[] {
  const columns = additionalColumns.map<IColumn>(({ key, name }) => ({
    ...columnBase(),
    key,
    name,
  }))

  return [clusterNameColumn, ...columns, statusColumn]
}
