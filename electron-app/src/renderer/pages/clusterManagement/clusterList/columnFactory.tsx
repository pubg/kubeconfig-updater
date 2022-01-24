import { IColumn } from '@fluentui/react'
import { Box, Tooltip, Typography } from '@mui/material'
import { Image } from '@mui/icons-material'
import { ClusterInformationStatus } from '../../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from '../UIStore/types'
import AWSImage from '../../../../../assets/product-icons/aws.png'
import AKSImage from '../../../../../assets/product-icons/aks.png'
import TencentImage from '../../../../../assets/product-icons/tencent.png'

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
    const label = item.data.dataresolversList[0].split('/')[0]

    return (
      <Tooltip title={tooltipString}>
        <Typography>{label}</Typography>
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
    const vendorRegexp = /AWS.*|Azure.*|Tencent.*/
    const vendor = item.data.dataresolversList.find((str) => !!vendorRegexp.exec(str))

    let iconSource: string | null = null

    if (vendor?.startsWith('AWS')) {
      iconSource = AWSImage
    }
    if (vendor?.startsWith('Azure')) {
      iconSource = AKSImage
    } else if (vendor?.startsWith('Tencent')) {
      iconSource = TencentImage
    }

    return (
      <Box display="flex" alignItems="center" gap="8px">
        {iconSource && <img src={iconSource} alt="" style={{ height: '2em' }} />}
        <Typography>{item.data.metadata.clustername}</Typography>
      </Box>
    )
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
        return <Typography>(Suggested) Not Registered</Typography>

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
