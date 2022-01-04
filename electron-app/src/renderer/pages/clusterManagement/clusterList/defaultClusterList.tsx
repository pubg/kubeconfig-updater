import { DetailsList, IDetailsListProps } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { ClusterMetadataItem } from '../UIStore/types'

interface ClusterListProps {
  items: ClusterMetadataItem[]
  columns: IDetailsListProps['columns']
  selection: IDetailsListProps['selection']
  overrides?: Partial<IDetailsListProps>
}

export default observer(function DefaultClusterList({ items, columns, selection, overrides }: ClusterListProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DetailsList {...overrides} items={items} columns={columns} selection={selection} />
})
