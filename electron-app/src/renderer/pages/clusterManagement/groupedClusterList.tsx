import { DetailsList, IColumn, IGroup, ISelection } from '@fluentui/react'
import { Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import LINQ from 'linq'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import { ClusterMetadataItem } from './clusterMetadataStore'

export type GroupedItem = [string | null, ClusterMetadataItem[]]

// TODO: refactor this code
const columns: IColumn[] = [
  {
    key: 'clusterName',
    name: 'Cluster Name',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterMetadataItem) => {
      return <Typography>{item.data.metadata.clustername}</Typography>
    },
  },
  {
    key: 'status',
    name: 'Status',
    minWidth: 128,
    isResizable: true,
    onRender(item: ClusterMetadataItem) {
      switch (item.data.status) {
        case ClusterInformationStatus.REGISTERED_OK:
          return <Typography>Registered</Typography>

        case ClusterInformationStatus.SUGGESTION_OK:
          return <Typography>Not Registerd</Typography>

        case ClusterInformationStatus.REGISTERED_UNKNOWN:
          return <Typography>Unknown</Typography>

        default:
          return <Typography>Error</Typography>
      }
    },
  },
]

function groupByTag(data: ClusterMetadataItem[], tag: string): [string | null, ClusterMetadataItem[]][] {
  const groupedItems = LINQ.from(data)
    .groupBy((item) => item.tags.get(tag) ?? null)
    .select((e) => [e.key(), e.toArray()])
    .toArray() as [string | null, ClusterMetadataItem[]][]

  return groupedItems
}

function getIGroups(groupedItems: [string | null, ClusterMetadataItem[]][]): IGroup[] {
  const groups: IGroup[] = []
  let offset = 0

  for (const [key, items] of groupedItems) {
    groups.push({
      key: key ?? 'NULL',
      name: key ?? 'others',
      count: items.length,
      startIndex: offset,
    })

    offset += items.length
  }

  return groups
}

interface GroupedClusterListProps {
  tag: string
  selection: ISelection
  items: ClusterMetadataItem[]
}

export default observer(function GroupedClusterList({ tag, items, selection }: GroupedClusterListProps) {
  const groupedItems = useMemo(() => groupByTag(items, tag), [items, tag])
  const IGroups = useMemo(() => getIGroups(groupedItems), [groupedItems])

  return <DetailsList groups={IGroups} items={items} columns={columns} selection={selection} />
})
