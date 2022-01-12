import { Box, Paper } from '@mui/material'
import { ThemeProvider } from '@fluentui/react'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import TopBar from './topBar'
import BottomBar from './bottomBar'
import ProgressSnackbar from './progressSnackbar'
import { ContainerContextProvider, useResolve } from '../../hooks/container'
import ThemeStore from '../../store/themeStore'
import ClusterInfoList from './clusterList'
import ClusterMetadataStore from '../../store/clusterMetadataStore'
import ErrorNotification from './errorNotification'
import RegStatusModal from './regStatusModal'

export default observer(function ClusterManagement() {
  const clusterMetadataStore = useResolve(ClusterMetadataStore)
  const { fluentUiTheme } = useResolve(ThemeStore)

  // invoke on mount
  useEffect(() => {
    clusterMetadataStore.fetchMetadata()
  }, [clusterMetadataStore])

  return (
    <ContainerContextProvider>
      {/* background */}
      <Paper sx={{ width: '100%', height: '100%' }} square>
        <RegStatusModal />
        <ErrorNotification />

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
            <Box height="100%" overflow="hidden" sx={{ overflowY: 'scroll' }}>
              <ThemeProvider theme={fluentUiTheme}>
                <ClusterInfoList />
              </ThemeProvider>
            </Box>
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
    </ContainerContextProvider>
  )
})
