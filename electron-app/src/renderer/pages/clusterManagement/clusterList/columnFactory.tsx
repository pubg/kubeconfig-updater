import { IColumn } from '@fluentui/react'
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { ClusterInformationStatus } from '../../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from '../UIStore/types'
import EKSImage from '../../../../../assets/product-icons/eks.svg'
import AKSImage from '../../../../../assets/product-icons/aks.png'
import TencentImage from '../../../../../assets/product-icons/tencent.png'
import GkeImage from '../../../../../assets/product-icons/gke.png'
import RancherImage from '../../../../../assets/product-icons/rancher.png'
import OpenshiftImage from '../../../../../assets/product-icons/openshift.png'
import NcpImage from '../../../../../assets/product-icons/ncp.png'
import KubeImage from '../../../../../assets/product-icons/kubernetes.svg'
import ArgoImage from '../../../../../assets/product-icons/argo.png'

function columnBase(): Partial<IColumn> & { minWidth: number } {
  return {
    minWidth: 0,
    isResizable: true,
  }
}

const dataSourceColumn: IColumn = {
  ...columnBase(),
  key: 'dataSource',
  name: 'Data Sources',
  minWidth: 240,
  onRender: (item: ClusterMetadataItem) => {
    if (item.data.dataresolversList.length === 0) {
      return <Typography>NOT EXISTS</Typography>
    }

    const resolverDescs = item.data.dataresolversList
    resolverDescs.sort()

    const tooltipString = resolverDescs.join('\n')

    return (
      <Tooltip title={tooltipString}>
        <Stack direction="row" spacing={1}>
          {resolverDescs.map((resolverDesc) => {
            return (
              <Chip color="default" style={{ borderRadius: '4px' }} size="small" label={resolverDesc.split('/')[0]} />
            )
          })}
        </Stack>
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
    let iconSource: string | null = null

    if (item.tags.has('ClusterEngine')) {
      const engineName = item.tags.get('ClusterEngine')
      if (engineName === 'EKS') {
        iconSource = EKSImage
      } else if (engineName === 'AKS') {
        iconSource = AKSImage
      } else if (engineName === 'TKE') {
        iconSource = TencentImage
      } else if (engineName === 'GKE') {
        iconSource = GkeImage
      } else if (engineName === 'RKE') {
        iconSource = RancherImage
      } else if (engineName === 'Openshift') {
        iconSource = OpenshiftImage
      } else if (engineName === 'NCP' || engineName === 'NKE') {
        iconSource = NcpImage
      } else if (engineName?.includes('Argo')) {
        iconSource = ArgoImage
      } else {
        iconSource = KubeImage
      }
    }

    return (
      <Box display="flex" alignItems="center" gap="8px">
        {iconSource && <img src={iconSource} alt="" style={{ height: 'auto', width: '2em' }} />}
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
        return <Typography>Suggested (Not Registered)</Typography>

      case ClusterInformationStatus.REGISTERED_NOTOK_CRED_RES_NOTOK:
        return <Typography>Registered (Credential Resolver invalid)</Typography>

      case ClusterInformationStatus.SUGGESTION_NOTOK_CRED_RES_NOTOK:
        return <Typography>Suggested (Credential Resolver invalid)</Typography>

      case ClusterInformationStatus.REGISTERED_NOTOK_NO_CRED_RESOLVER:
        return <Typography>Registered (Credential Resolver not set)</Typography>

      case ClusterInformationStatus.SUGGESTION_NOTOK_NO_CRED_RESOLVER:
        return <Typography>Suggested (Credential Resolver not set)</Typography>

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
