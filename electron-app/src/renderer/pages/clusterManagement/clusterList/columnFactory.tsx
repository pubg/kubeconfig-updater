import { IColumn } from '@fluentui/react'
import { Tooltip, Typography } from '@mui/material'
import { ClusterInformationStatus } from '../../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from '../UIStore/types'

function columnBase(): Partial<IColumn> & { minWidth: number } {
  return {
    minWidth: 0,
    isResizable: true,
  }
}

function formatDatasourceString(sources: string): string {
  const sliced = sources.split('/')

  const string = sliced.slice(-2).join('/')

  return sliced.length > 2 ? `...${string}` : string
}

const dataSourceColumn: IColumn = {
  ...columnBase(),
  key: 'dataSource',
  name: 'Data Source',
  minWidth: 240,
  onRender: (item: ClusterMetadataItem) => {
    if (item.data.dataresolversList.length === 0) {
      return <Typography>NOT EXISTS</Typography>
    }

    const tooltipString = item.data.dataresolversList.join('\n')
    const previewString = formatDatasourceString(item.data.dataresolversList[0])

    return (
      <Tooltip title={tooltipString}>
        <Typography>{previewString}</Typography>
      </Tooltip>
    )
  },
}

const clusterNameColumn: IColumn = {
  ...columnBase(),
  key: 'clusterName',
  name: 'Cluster Name',
  // maxWidth: 960,
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
  minWidth: 360,
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

  return [clusterNameColumn, ...columns, dataSourceColumn, statusColumn]
}
