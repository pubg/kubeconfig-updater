import { DetailsList, IDetailsListProps, IGroup } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import LINQ from 'linq'
import { useMemo } from 'react'
import { ClusterMetadataItem } from '../UIStore/types'

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
  items: ClusterMetadataItem[]
  tag: string
  columns: IDetailsListProps['columns']
  selection: IDetailsListProps['selection']
  overrides?: Partial<IDetailsListProps>
}

export default observer(function GroupedClusterList({
  items,
  columns,
  selection,
  tag,
  overrides,
}: GroupedClusterListProps) {
  const { groupedItems, orderedItems } = useMemo(() => groupByTag(items, tag), [items, tag])
  const groups = useMemo(() => getIGroups(groupedItems), [groupedItems])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DetailsList {...overrides} groups={groups} items={orderedItems} columns={columns} selection={selection} />
})
