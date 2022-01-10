import { Box, Container, Typography, Button, ButtonProps, PopperProps, ClickAwayListener } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useResolve } from '../../hooks/container'
import UIStore from './uiStore'
import ConfigList from './configList'
import ConfigAddModal, { ConfigAddModalProps } from './configAddModal'
import browserLogger from '../../logger/browserLogger'
import ObservedCredResolverConfig from './credResolverConfig'
import { CredentialResolverKind, CredResolverConfig } from '../../protos/kubeconfig_service_pb'

export default observer(function CredResolver() {
  const uiStore = useResolve(UIStore)

  // only calls one time on mount
  useEffect(() => {
    uiStore.fetchCredResolvers(true)
    uiStore.fetchProfiles()
  }, [uiStore])

  const [anchorEl, setAnchorEl] = useState<Element | null>()

  const onAddConfigClicked: ButtonProps['onClick'] = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const popperProps: PopperProps = {
    anchorEl,
    open: !!anchorEl,
    transition: true,
  }

  const onAddConfigSubmit: ConfigAddModalProps['onSubmit'] = (data) => {
    // close window
    setAnchorEl(null)

    const config = new CredResolverConfig().toObject()
    config.accountid = data.account
    config.infravendor = data.vendor

    uiStore.credResolverStore.setCredResolver(new ObservedCredResolverConfig(config))
  }

  return (
    <Container
      maxWidth="md"
      sx={{ pt: '64px', pb: '64px', height: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      {/* title */}
      <Typography variant="h3">Credentials Resolver Setting</Typography>

      {/* header (including menus) */}
      <Box display="flex" alignItems="center" justifyContent="right">
        <Button variant="outlined" onClick={onAddConfigClicked}>
          Add new config
        </Button>
      </Box>

      {/* config add modal */}
      {!!anchorEl && (
        <ConfigAddModal
          popperProps={popperProps}
          onSubmit={onAddConfigSubmit}
          onAbort={() => {
            setAnchorEl(null)
          }}
        />
      )}

      {/* TODO: calculate max height to support sticky */}
      <Box height="100%" overflow="hidden" sx={{ overflowY: 'auto' }}>
        <ConfigList />
      </Box>
    </Container>
  )
})
