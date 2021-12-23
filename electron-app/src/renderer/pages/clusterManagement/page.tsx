import { Box, Paper } from '@mui/material'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'
import TopBar from './topBar'
import BottomBar from './bottomBar'
import ClusterInfoList from './clusterInfoList'
import { useContext as useMetadataRequesterContext } from '../../components/clusterMetadataRequester'

export default observer(function ClusterManagement() {
  const clusterMetadataStore = useStore()
  const clusterMetadataRequester = useMetadataRequesterContext()

  // TODO: improve this
  useEffect(() => {
    // IIFE
    ;(async () => {
      await clusterMetadataRequester.fetchMetadata()

      const clusterMetadataItems = clusterMetadataRequester.items.map<ClusterMetadataItem>((item) =>
        ClusterMetadataItem.fromObject(item)
      )

      clusterMetadataStore.setItems(clusterMetadataItems)
    })()
    // intentionally ignore this warning because we want to call this only once in onMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // FIXME: sorting works but only one time, this is incorrect implementation (for mock-ups)
  // and need to be fixed when doing proper implementation
  /*
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
  */

  /*
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

  const renderItemColumn = useCallback((item?: any, index?: number, column?: IColumn) => {
    return <div />
  }, [])
  */

  return (
    /** background */
    <Paper sx={{ width: '100%', height: '100%' }} square>
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
          square
          elevation={0}
          sx={{
            height: '128px',
            display: 'flex',
            borderBottom: '2px solid gray',
          }}
        >
          <TopBar />
        </Paper>

        <Box height="100%" overflow="hidden" sx={{ overflowY: 'scroll' }}>
          <ClusterInfoList />
        </Box>

        {/* bottom sidebar container */}
        <Box width="100%" height="64px" display="flex" alignItems="center" margin="8px" paddingLeft="16px">
          <BottomBar />
        </Box>
      </Box>
    </Paper>
  )
})
