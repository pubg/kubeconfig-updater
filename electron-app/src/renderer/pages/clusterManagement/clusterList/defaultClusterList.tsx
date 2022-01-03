import { IDetailsListProps } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { ClusterMetadataItem } from '../UIStore/types'

interface ClusterListProps {
  items: ClusterMetadataItem[]
  columns: IDetailsListProps['columns']
  selection: IDetailsListProps['selection']
  overrides?: Partial<IDetailsListProps>
}

export default observer(function DefaultClusterList({ items, columns, selection }: ClusterListProps) {
  return <div />
})
