import { Box, Container, List, ListItem, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import LINQ from 'linq'
import CredentialsResolverList from '../../components/credentialsResolverList'
import { CredentialsSelectionProps } from '../../components/credentialsSelection'
import { useResolve } from '../../hooks/container'
import UIStore from './UIStore'
import { RESOLVER_DEFAULT, RESOLVER_ENV, RESOLVER_IMDS, RESOLVER_PROFILE_FACTORY, RESOLVER_UNKNOWN } from './const'
import { CredResolverConfig } from '../../protos/kubeconfig_service_pb'
import CredentialSelectionListItem from './CredentialSelectionListItem'

// TODO: make dedicated UI Store with Model, and use that.
export default observer(function CredResolver() {
  const uiStore = useResolve(UIStore)
  const { credResolverStore, profileStore } = uiStore

  // only calls one time on mount
  useEffect(() => {
    uiStore.fetchCredResolvers()
    uiStore.fetchProfiles()
  }, [uiStore])

  // NOTE: if we use useMemo with observed, doesn't it render this component twice?
  // does it need a custom hook?
  const groups = useMemo<{ vendor: string; items: CredResolverConfig.AsObject[] }[]>(() => {
    const grouped = LINQ.from(credResolverStore.credResolvers)
      .groupBy((credResolver) => credResolver.infravendor)
      .select((g) => ({
        vendor: g.key(),
        items: g.toArray(),
      }))
      .toArray()

    return grouped
  }, [credResolverStore.credResolvers])

  return (
    <Container maxWidth="md" sx={{ pt: '64px', pb: '64px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3">Credentials Resolver Setting</Typography>
      {/* TODO: calculate max height to support sticky */}
      <Box height="100%" overflow="hidden" sx={{ overflowY: 'auto' }}>
        <List sx={{ border: '1px solid red' }}>
          {uiStore.state === 'ready' &&
            groups.map(({ vendor, items }) => (
              <ListItem key={vendor} divider>
                <CredentialsResolverList vendor={vendor}>
                  {items.map((item) => (
                    <CredentialSelectionListItem key={item.accountid} item={item} />
                  ))}
                </CredentialsResolverList>
              </ListItem>
            ))}
        </List>
      </Box>
    </Container>
  )
})
