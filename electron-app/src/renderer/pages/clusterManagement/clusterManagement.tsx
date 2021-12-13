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
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Enumerable from 'linq'
import _ from 'lodash'
import { useCallback, useState } from 'react'
import {
  ClusterInfo,
  Status,
} from '../../../shared/models/clusterInfo/clusterInfo'
import { generateMockClusterInfos } from '../../../shared/models/clusterInfo/mockClusterInfo'

const mockTags = ['stage', 'vendor', 'region']

const items = generateMockClusterInfos(64)

export default function ClusterManagement() {
  const [showRegistered, setShowRegistered] = useState(false)

  const [listItems, setListItems] = useState(items)

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

  const itemFilter = (item: ClusterInfo) => {
    return showRegistered || (!showRegistered && item.status !== 'Registered')
  }

  const columns: IColumn[] = [
    {
      key: 'clusterName',
      name: 'Cluster Name',
      fieldName: 'clusterName',
      minWidth: 0,
      isResizable: true,
    },
    {
      key: 'vendor',
      name: 'Infra Vendor',
      fieldName: 'vendor',
      minWidth: 0,
      isResizable: true,
    },
    {
      key: 'account',
      name: 'Account',
      fieldName: 'account',
      minWidth: 256,
      isResizable: true,
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 0,
      isResizable: true,
      onRender: (item: ClusterInfo) => {
        return (
          <Typography color={colorFormatForStatus(item.status)}>
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
          <IconButton color="primary">
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
          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            margin="32px 32px 32px 32px"
          >
            <FormGroup row sx={{ gap: '16px', alignItems: 'center' }}>
              <TextField
                size="small"
                id="outlined-basic"
                label="filter by name"
                variant="outlined"
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => setShowRegistered(e.target.checked)}
                  />
                }
                label="Show Registered"
              />
              <Autocomplete
                multiple
                options={mockTags}
                disableCloseOnSelect
                getOptionLabel={(opt) => opt}
                style={{ width: '256px' }}
                size="small"
                renderInput={(params) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <TextField {...params} label="Group with Tag" />
                )}
                renderOption={(props, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option}
                  </li>
                )}
              />
            </FormGroup>
            <Stack direction="row">
              <Button variant="outlined" startIcon={<Refresh />}>
                Reload
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* list container */}
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
            overflowY: 'scroll',
            marginTop: '4px',
          }}
        >
          <DetailsList
            items={listItems.filter(itemFilter)}
            columns={columns}
            onColumnHeaderClick={onColumnClick}
            // layoutMode={DetailsListLayoutMode.justified}
            // onRenderItemColumn={renderItemColumn}
          />
        </Box>

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
  )
}
