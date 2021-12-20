import { Box, Paper } from '@mui/material'
import { useEffect } from 'react'
import { container } from 'tsyringe'
import { observer, useLocalStore } from 'mobx-react-lite'
import { ClusterMetadataRequester, ClusterMetadataRequesterContext } from '../../components/clusterMetadataRequester'
import { ClusterRegisterRequester, ClusterRegisterRequesterContext } from '../../components/clusterRegisterRequester'
import { ClusterMetadataItem, ClusterMetadataStore, ClusterMetadataStoreContext } from './clusterMetadataStore'
import TopBar from './topBar'
import BottomBar from './bottomBar'
import ClusterInfoList from './clusterInfoList'
import * as containerHooks from '../../hooks/container'

export default observer(function ClusterManagement() {
  const clusterMetadataStore = containerHooks.useResolve(ClusterMetadataStore)
  const clusterRegisterRequester = containerHooks.useResolve(ClusterRegisterRequester)
  const clusterMetadataRequester = containerHooks.useResolve(ClusterMetadataRequester)

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
    <ClusterMetadataRequesterContext.Provider value={clusterMetadataRequester}>
      <ClusterRegisterRequesterContext.Provider value={clusterRegisterRequester}>
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
                {clusterMetadataRequester.state === 'fetch' && <p>loading...</p>}
                <ClusterInfoList />
              </Box>

              {/* bottom sidebar container */}
              <Box width="100%" height="64px" display="flex" alignItems="center" margin="8px" paddingLeft="16px">
                <BottomBar />
              </Box>
            </Box>
          </Paper>
        </ClusterMetadataStoreContext.Provider>
      </ClusterRegisterRequesterContext.Provider>
    </ClusterMetadataRequesterContext.Provider>
  )
})
