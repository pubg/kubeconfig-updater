import { Box, Container, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useResolve } from '../../hooks/container'
import UIStore from './uiStore'
import ConfigList from './configList'

export default observer(function CredResolver() {
  const uiStore = useResolve(UIStore)

  // only calls one time on mount
  useEffect(() => {
    uiStore.fetchCredResolvers(true)
    uiStore.fetchProfiles()
  }, [uiStore])

  return (
    <Container maxWidth="md" sx={{ pt: '64px', pb: '64px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3">Credentials Resolver Setting</Typography>
      {/* TODO: calculate max height to support sticky */}
      <Box height="100%" overflow="hidden" sx={{ overflowY: 'auto' }}>
        <ConfigList />
      </Box>
    </Container>
  )
})
