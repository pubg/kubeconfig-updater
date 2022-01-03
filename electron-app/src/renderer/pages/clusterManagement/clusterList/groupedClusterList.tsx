import { IDetailsListProps } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { ClusterMetadataItem } from '../UIStore/types'

interface GroupedClusterListProps {
  items: ClusterMetadataItem[]
  tag: string
  columns: IDetailsListProps['columns']
  selection: IDetailsListProps['selection']
  overrides?: Partial<IDetailsListProps>
}

export default observer(function GroupedClusterList({ items, columns, selection, tag }: GroupedClusterListProps) {
  return <div />
})
