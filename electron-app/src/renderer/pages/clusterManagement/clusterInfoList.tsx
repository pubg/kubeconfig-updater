import { DetailsList, IColumn, IDetailsListProps } from '@fluentui/react'
import { IObjectWithKey, ISelection, Selection } from '@fluentui/react/lib/DetailsList'
import { observer } from 'mobx-react-lite'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { MetadataItem, useStore } from './clusterMetadataStore'

interface ListItem extends IObjectWithKey {
  clusterName: string
  credentialsResolverId: string
  tags: Map<string, string>

  data: MetadataItem
}

function tagArrayToMap(arr: [string, string][]): Map<string, string> {
  return arr.reduce((map, [k, v]) => map.set(k, v), new Map<string, string>())
}

function ClusterInfoList() {
  const store = useStore()

  // variables
  // QUESTION: should I use setSelection? does it notify other components to update?
  const [selection, setSelection] = useState(
    new Selection<ListItem>({
      onSelectionChanged: () => {
        store.setSelectedItems(selection.getSelection().map((item) => item.data))
      },
    })
  )

  const items = useMemo((): ListItem[] => {
    const filteredItems = store.filter ? store.items.filter(store.filter) : store.items

    return filteredItems.map((item) => ({
      clusterName: item.data.metadata.clustername,
      tags: tagArrayToMap(item.data.metadata.clustertagsMap),
      credentialsResolverId: item.data.metadata.credresolverid,
      data: item,
    }))
  }, [store.items, store.filter])

  const columns: IColumn[] = [
    {
      key: 'clusterName',
      fieldName: 'clusterName',
      name: 'Cluster Name',
      minWidth: 0,
    },
    {
      key: 'credentialsResolverId',
      fieldName: 'credentialsResolverId',
      name: 'Credentials Resolver Id',
      minWidth: 0,
    },
  ]

  // TODO:
  const onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick'] = () => {}

  return (
    <>
      <DetailsList columns={columns} items={items} onColumnHeaderClick={onHeaderNameClicked} selection={selection as Selection} />
      {/* <Menu></Menu> */}
    </>
  )
}

export default observer(ClusterInfoList)
