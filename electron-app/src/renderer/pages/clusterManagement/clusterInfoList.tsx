import { DetailsList, IColumn, IDetailsListProps } from '@fluentui/react'
import { Box } from '@mui/material'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { MetadataItem, useStore } from './clusterMetadataStore'

interface ListItem {
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

  const items = useMemo((): ListItem[] => {
    const filteredItems = store.filter
      ? store.items.filter(store.filter)
      : store.items

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
  const onHeaderNameClicked = () => {}

  return (
    <Box height="100%">
      <DetailsList
        columns={columns}
        items={items}
        onColumnHeaderClick={onHeaderNameClicked}
      />
      {/* <Menu></Menu> */}
    </Box>
  )
}

export default observer(ClusterInfoList)
