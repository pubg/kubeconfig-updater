import { DetailsList, IColumn, IDetailsListProps, ThemeProvider } from '@fluentui/react'
import { Selection } from '@fluentui/react/lib/DetailsList'
import { Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import LINQ from 'linq'
import { toJS } from 'mobx'
import { container } from 'tsyringe'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import browserLogger from '../../logger/browserLogger'
import { ThemeStore } from '../../components/themeStore'
import { useAutorun } from '../../hooks/mobx'

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

  // TODO
  const onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick'] = () => {}

  const onActiveItemChanged: IDetailsListProps['onActiveItemChanged'] = useCallback((proxy) => {
    const item = toJS<ClusterMetadataItem>(proxy)
    browserLogger.debug(item)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <DetailsList
        columns={columns}
        items={items}
        onColumnHeaderClick={onHeaderNameClicked}
        selection={store.selectionRef as Selection}
        onActiveItemChanged={onActiveItemChanged}
      />
      {/* <Menu></Menu> */}
    </ThemeProvider>
  )
})
