import { Box, Container, List, ListItem, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import LINQ from 'linq'
import CredentialsResolverList from '../../components/credentialsResolverList'
import { useResolve } from '../../hooks/container'
import UIStore from './UIStore'
import browserLogger from '../../logger/browserLogger'
import { ObservedCredResolverConfig } from '../../store/credResolverStore'

// TODO: make dedicated UI Store with Model, and use that.
export default observer(function CredResolver() {
  const uiStore = useResolve(UIStore)
  const { credResolverStore } = uiStore

  // only calls one time on mount
  useEffect(() => {
    uiStore.fetchCredResolvers()
    uiStore.fetchProfiles()
  }, [uiStore])

  // NOTE: if we use useMemo with observed, doesn't it render this component twice?
  // does it need a custom hook?
  const groups = useMemo<{ vendor: string; items: ObservedCredResolverConfig[] }[]>(() => {
    const grouped = LINQ.from(credResolverStore.credResolvers)
      .groupBy((credResolver) => credResolver.infravendor)
      .select((g) => ({
        vendor: g.key(),
        items: g.toArray().sort((a, b) => a.accountid.localeCompare(b.accountid)),
      }))
      .orderBy(({ vendor }) => vendor)
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
                <CredentialsResolverList vendor={vendor} items={items} />
              </ListItem>
            ))}
        </List>
      </Box>
    </Container>
  )
})
