import { Box, Container, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useResolve } from '../../hooks/container'
import UIStore from './UIStore'
import ConfigList from './configList'
import { useAutorun, useReaction } from '../../hooks/mobx'

// TODO: make dedicated UI Store with Model, and use that.
export default observer(function CredResolver() {
  const uiStore = useResolve(UIStore)

  // only calls one time on mount
  useEffect(() => {
    uiStore.fetchCredResolvers(true)
    uiStore.fetchProfiles()
  }, [uiStore])

  useAutorun(() => {
    console.log('uiStore state: ', uiStore.state)
  })

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
