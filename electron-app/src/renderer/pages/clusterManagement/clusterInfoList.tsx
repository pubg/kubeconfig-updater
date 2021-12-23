import { DetailsList, IColumn, IDetailsListProps, Theme, ThemeProvider } from '@fluentui/react'
import { Selection } from '@fluentui/react/lib/DetailsList'
import { PaletteMode, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import LINQ from 'linq'
import { toJS } from 'mobx'
import { AzureThemeDark, AzureThemeLight } from '@fluentui/azure-themes'
import logger from '../../../logger/logger'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'

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

function getFluentuiTheme(): Theme {
  logger.info(`Init FluentUi Theme: ${window.theme}, Default is AzureThemeLight`)
  if (window.theme) {
    if (window.theme === 'dark') {
      return AzureThemeDark
    }
    if (window.theme === 'light') {
      return AzureThemeLight
    }
    return AzureThemeLight
  }
  return AzureThemeLight
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

  const items = useMemo<ClusterMetadataItem[]>(() => {
    let linq = LINQ.from(store.items).where(store.filter ?? (() => true))

    // TODO: add sorting key selector
    const sortKeySelector = ({ data }: ClusterMetadataItem) => data.metadata.clustername
    linq = descending ? linq.orderByDescending(sortKeySelector) : linq.orderBy(sortKeySelector)

    return linq.toArray()
  }, [descending, store.filter, store.items])

  // TODO
  const onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick'] = () => {}

  const onActiveItemChanged: IDetailsListProps['onActiveItemChanged'] = useCallback((proxy) => {
    const item = toJS<ClusterMetadataItem>(proxy)
    logger.debug(item)
  }, [])

  return (
    <ThemeProvider theme={getFluentuiTheme()}>
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
