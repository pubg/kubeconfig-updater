import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import LINQ from 'linq'
import { IDetailsListProps, Selection } from '@fluentui/react'
import { toJS } from 'mobx'
import { useResolve } from '../../../hooks/container'
import ClusterManagementUIStore from '../UIStore/ClusterManagementUIStore'
import { ClusterMetadataItem } from '../UIStore/types'
import GroupedClusterList from './groupedClusterList'
import DefaultClusterList from './defaultClusterList'
import columnsFactory from './columnFactory'
import browserLogger from '../../../logger/browserLogger'
import ContextMenu, { ContextMenuProps } from './contextMenu'

export default observer(function ClusterList() {
  const store = useResolve(ClusterManagementUIStore)

  // TODO: add descending order feature
  const [descending, setDescending] = useState(false)
  const isGrouped = store.selectedGroupTag !== null

  const items = useMemo(() => {
    let linq = LINQ.from(store.items).where(store.filter ?? (() => true))

    // TODO: add sorting key selector
    const sortKeySelector = ({ data }: ClusterMetadataItem) => data.metadata.clustername
    linq = descending ? linq.orderByDescending(sortKeySelector) : linq.orderBy(sortKeySelector)

    return linq.toArray()
  }, [descending, store.filter, store.items])

  // TODO: implement custom column
  const columns = columnsFactory([])

  const onActiveItemChanged: IDetailsListProps['onActiveItemChanged'] = useCallback((proxy) => {
    const item = toJS<ClusterMetadataItem>(proxy)
    browserLogger.debug(item)
  }, [])

  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [contextItem, setContextItem] = useState<ClusterMetadataItem | null>(null)

  const onItemContextMenu = useCallback((item: ClusterMetadataItem, index: any, e?: PointerEvent) => {
    e?.preventDefault()
    if (e) {
      setContextItem(item)
      setPos({ left: e.x, top: e.y })
    } else {
      setPos(null)
    }
  }, []) as IDetailsListProps['onItemContextMenu']

  const onItemContextMenuDismiss = () => {
    setPos(null)
  }

  // TODO: width not limited to 100%
  return (
    <div>
      <ContextMenu
        onSelected={onItemContextMenuDismiss}
        onDismiss={onItemContextMenuDismiss}
        position={pos ?? undefined}
        item={contextItem}
      />
      {isGrouped && store.selectedGroupTag ? (
        // when grouped
        <GroupedClusterList
          items={items}
          columns={columns}
          tag={store.selectedGroupTag}
          selection={store.selectionRef as Selection}
          overrides={{ onActiveItemChanged, onItemContextMenu }}
        />
      ) : (
        // when not grouped
        <DefaultClusterList
          items={items}
          columns={columns}
          selection={store.selectionRef as Selection}
          overrides={{ onActiveItemChanged, onItemContextMenu }}
        />
      )}
    </div>
  )
})
