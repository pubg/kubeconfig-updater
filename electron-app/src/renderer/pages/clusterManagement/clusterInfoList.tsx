import { DetailsList, IColumn, IDetailsListProps, ThemeProvider, GroupedList } from '@fluentui/react'
import { IGroupedListProps, Selection } from '@fluentui/react/lib/DetailsList'
import { Box, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import LINQ from 'linq'
import { toJS } from 'mobx'
import { container } from 'tsyringe'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import browserLogger from '../../logger/browserLogger'
import { useAutorun } from '../../hooks/mobx'
import ThemeStore from '../../components/themeStore'

/*
const columns: IColumn[] = [
  {
    key: 'clusterName',
    name: 'Cluster Name',
    fieldName: 'clusterName',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.clusterName}</Typography>
    },
  },
  {
    key: 'vendor',
    name: 'Infra Vendor',
    fieldName: 'vendor',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.vendor}</Typography>
    },
  },
  {
    key: 'account',
    name: 'Account',
    fieldName: 'account',
    minWidth: 256,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.account}</Typography>
    },
  },
  {
    key: 'status',
    name: 'Status',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return (
        <Typography variant="body1" color={colorFormatForStatus(item.status)}>
          {item.status}
        </Typography>
      )
    },
  },
  {
    key: 'action',
    name: 'action',
    minWidth: 64,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return (
        <IconButton
          color="primary"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            setMenuAnchor(e.currentTarget)
          }}
        >
          <MoreVertOutlined />
        </IconButton>
      )
    },
  },
]
*/

function groupByTag(data: ClusterMetadataItem[], tag: string): [string | null, ClusterMetadataItem[]][] {
  const groupedItems = LINQ.from(data)
    .groupBy((item) => item.tags.get(tag) ?? null)
    .select((e) => [e.key(), e.toArray()])
    .toArray() as [string | null, ClusterMetadataItem[]][]

  return groupedItems
}

export default observer(function ClusterInfoList() {
  const store = useStore()

  const [descending, setDescending] = useState(false)

  // TODO: add dyanmic column add/delete
  const columns = useMemo<IColumn[]>(() => {
    return [
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
              return <Typography>Not Registered</Typography>

            case ClusterInformationStatus.REGISTERED_UNKNOWN:
              return <Typography>Unknown</Typography>

            default:
              return <Typography>Error</Typography>
          }
        },
      },
    ]
  }, [])

  const isGrouped = store.selectedGroupTag !== null

  const items = useMemo<ClusterMetadataItem[]>(() => {
    let linq = LINQ.from(store.items).where(store.filter ?? (() => true))

    // TODO: add sorting key selector
    const sortKeySelector = ({ data }: ClusterMetadataItem) => data.metadata.clustername
    linq = descending ? linq.orderByDescending(sortKeySelector) : linq.orderBy(sortKeySelector)

    return linq.toArray()
  }, [descending, store.filter, store.items])

  const themeStore = container.resolve(ThemeStore)
  const [theme, setTheme] = useState(themeStore.getFluentUiTheme())
  useAutorun(() => {
    setTheme(themeStore.getFluentUiTheme())
  })

  const groupedItems = useMemo(() => {
    return store.selectedGroupTag ? groupByTag(items, store.selectedGroupTag) : []
  }, [items, store.selectedGroupTag])

  // TODO
  const onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick'] = () => {}

  const onActiveItemChanged: IDetailsListProps['onActiveItemChanged'] = useCallback((proxy) => {
    const item = toJS<ClusterMetadataItem>(proxy)
    browserLogger.debug(item)
  }, [])

  const onRenderCell: IGroupedListProps['onRenderCell'] = (depthLevel, item, index) => {}

  // TODO: split GroupedList to another component
  return (
    <Box height="100%" overflow="hidden" sx={{ overflowY: 'scroll' }}>
      <ThemeProvider theme={theme}>
        {isGrouped ? (
          <GroupedList items={groupedItems} onRenderCell={onRenderCell} />
        ) : (
          <DetailsList
            columns={columns}
            items={items}
            onColumnHeaderClick={onHeaderNameClicked}
            selection={store.selectionRef as Selection}
            onActiveItemChanged={onActiveItemChanged}
          />
        )}
        {/* <Menu></Menu> */}
      </ThemeProvider>
    </Box>
  )
})
