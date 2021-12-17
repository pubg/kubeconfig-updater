import { MoreVertOutlined } from '@mui/icons-material'
import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material'
import Enumerable from 'linq'
import React, { useCallback, useEffect, useState } from 'react'
import { container } from 'tsyringe'
import { IColumn } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import { ClusterInfo, Status } from '../../models/clusterInfo/clusterInfo'
import { generateMockClusterInfos } from '../../models/clusterInfo/mockClusterInfo'
import { ClusterMetadataStore, ClusterMetadataStoreContext } from './clusterMetadataStore'
import TopBar from './topBar'
import BottomBar from './bottomBar'
import ClusterInfoList from './clusterInfoList'
import { KubeconfigClient } from '../../protos/Kubeconfig_serviceServiceClientPb'

const items = generateMockClusterInfos(64)

export default observer(function ClusterManagement() {
  const [listItems, setListItems] = useState(items)
  const clusterMetadataStore = container.resolve(ClusterMetadataStore)

  // TODO: remove this temp client variable

  // TODO: improve this
  useEffect(() => {
    clusterMetadataStore.fetchMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // FIXME: sorting works but only one time, this is incorrect implementation (for mock-ups)
  // and need to be fixed when doing proper implementation
  const onColumnClick = (e?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
    const sortKey = column?.fieldName
    if (!sortKey) {
      return
    }

    let descending = false

    if (column.isSorted) {
      descending = !descending
    }

    const sortedItemsLINQ = Enumerable.from(listItems).orderBy(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item) => (item as any)[sortKey]
    )

    if (descending) {
      sortedItemsLINQ.reverse()
    }

    const sortedItems = sortedItemsLINQ.toArray()

    setListItems(sortedItems)

    column.isSorted = true
  }

  const colorFormatForStatus = (status: Status) => {
    switch (status) {
      case 'Registered':
        return 'success'

      case 'Unregistered':
        return 'info'

      case 'Unknown':
        return 'warning'

      case 'Unauthorized':
        return 'error'

      default:
        throw new Error()
    }
  }

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const onMenuClick = () => {
    setMenuAnchor(null)
  }

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

  const renderItemColumn = useCallback((item?: any, index?: number, column?: IColumn) => {
    return <div />
  }, [])

  return (
    /** background */
    <ClusterMetadataStoreContext.Provider value={clusterMetadataStore}>
      <Paper sx={{ width: '100%', height: '100%' }}>
        {/* actual container */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'stretch',
          }}
        >
          {/* Header Menu Container */}
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '128px',
              display: 'flex',
              borderBottom: '2px solid gray',
            }}
          >
            <TopBar />
          </Paper>

          <Box height="100%" overflow="hidden" sx={{ overflowY: 'scroll' }}>
            {clusterMetadataStore.state === 'fetching' && <p>loading...</p>}
            <ClusterInfoList />
          </Box>

          {/* bottom sidebar container */}
          <Box width="100%" height="64px" display="flex" alignItems="center" margin="8px" paddingLeft="16px">
            <BottomBar />
          </Box>
        </Box>
      </Paper>
    </ClusterMetadataStoreContext.Provider>
  )
})
