import { DetailsList, IColumn } from '@fluentui/react'
import { MoreVertOutlined, Refresh } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Enumerable from 'linq'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'
import { container } from 'tsyringe'
import { ClusterInfo, Status } from '../../models/clusterInfo/clusterInfo'
import { generateMockClusterInfos } from '../../models/clusterInfo/mockClusterInfo'
import ClusterInfoListContainer from '../../containers/clusterInfoList'
import FilterBarContainer from '../../containers/filterBar'
import {
  ClusterMetadataStore,
  ClusterMetadataStoreContext,
} from '../../stores/clusterMetadataStore'

const mockTags = ['stage', 'vendor', 'region']

const items = generateMockClusterInfos(64)

export default function ClusterManagement() {
  const [showRegistered, setShowRegistered] = useState(false)

  const [listItems, setListItems] = useState(items)
  const clusterMetadataStore = container.resolve(ClusterMetadataStore)

  // TODO: improve this
  clusterMetadataStore.items = listItems.map((item) => ({ data: item as any }))

  // FIXME: sorting works but only one time, this is incorrect implementation (for mock-ups)
  // and need to be fixed when doing proper implementation
  const onColumnClick = (
    e?: React.MouseEvent<HTMLElement>,
    column?: IColumn
  ): void => {
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

  const renderItemColumn = useCallback(
    (item?: any, index?: number, column?: IColumn) => {
      return <div />
    },
    []
  )

  return (
    /** background */
    <ClusterMetadataStoreContext.Provider
      value={container.resolve(ClusterMetadataStore)}
    >
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
            <FilterBarContainer />
          </Paper>

          <ClusterInfoListContainer />

          {/* bottom sidebar container */}
          <Box
            width="100%"
            height="64px"
            display="flex"
            alignItems="center"
            margin="8px"
            paddingLeft="16px"
          >
            <Stack direction="row" width="100%" alignItems="center" gap="16px">
              <Button variant="outlined">Register ALL</Button>
              <Typography>0 Clusters Selected.</Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </ClusterMetadataStoreContext.Provider>
  )
}
