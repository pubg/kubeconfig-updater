import { DetailsList, IColumn, IDetailsListProps, IGroup, ISelection } from '@fluentui/react'
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

function groupByTag(data: ClusterMetadataItem[], tag: string) {
  const sortFunc = (key1: string | null, key2: string | null): number => {
    if (key1 === null) {
      return 1
    }

    if (key2 === null) {
      return -1
    }

    return key1.localeCompare(key2)
  }

  const groupedItems = (
    LINQ.from(data)
      .groupBy((item) => item.tags.get(tag) ?? null)
      .select((e) => [e.key(), e.toArray()])
      .toArray() as [string | null, ClusterMetadataItem[]][]
  ).sort(([k1], [k2]) => sortFunc(k1, k2))

  const orderedItems = groupedItems.map((grouped) => grouped[1]).flat()

  return { groupedItems, orderedItems }
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
  overrides?: Partial<IDetailsListProps>
  tag: string
  selection: ISelection
  items: ClusterMetadataItem[]
}

export default observer(function GroupedClusterList({ overrides, tag, items, selection }: GroupedClusterListProps) {
  const { groupedItems, orderedItems } = useMemo(() => groupByTag(items, tag), [items, tag])
  const IGroups = useMemo(() => getIGroups(groupedItems), [groupedItems])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DetailsList {...overrides} groups={IGroups} items={orderedItems} columns={columns} selection={selection} />
})
