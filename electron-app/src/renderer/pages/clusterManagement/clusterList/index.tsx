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

  browserLogger.debug('current Item: ', items)

  // TODO: width not limited to 100%
  return (
    <>
      {isGrouped && store.selectedGroupTag ? (
        // when grouped
        <GroupedClusterList
          items={items}
          columns={columns}
          tag={store.selectedGroupTag}
          selection={store.selectionRef as Selection}
          overrides={{ onActiveItemChanged }}
        />
      ) : (
        // when not grouped
        <DefaultClusterList
          items={items}
          columns={columns}
          selection={store.selectionRef as Selection}
          overrides={{ onActiveItemChanged }}
        />
      )}
    </>
  )
})
