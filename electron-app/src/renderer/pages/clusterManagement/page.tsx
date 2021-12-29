import { Box, Paper } from '@mui/material'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'
import TopBar from './topBar'
import BottomBar from './bottomBar'
import ClusterInfoList from './clusterInfoList'
import { useContext as useMetadataRequesterContext } from '../../components/clusterMetadataRequester'
import ProgressSnackbar from './progressSnackbar'
import RegisterErrorToNoti from '../../components/registerErrorToNoti'

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

  return (
    /** background */
    <Paper sx={{ width: '100%', height: '100%' }} square>
      <RegisterErrorToNoti />

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
          elevation={6}
          sx={{
            height: '128px',
            display: 'flex',
          }}
        >
          <TopBar />
        </Paper>

        <Box height="100%" overflow="hidden" position="relative">
          <ProgressSnackbar />
          <ClusterInfoList />
        </Box>

        {/* bottom sidebar container */}
        <Paper
          square
          elevation={6}
          sx={{
            width: '100%',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BottomBar />
        </Paper>
      </Box>
    </Paper>
  )
})
