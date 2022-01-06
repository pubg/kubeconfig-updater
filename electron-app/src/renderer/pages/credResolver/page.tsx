import { Box, Container, List, ListItem, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import LINQ from 'linq'
import CredentialsResolverList from '../../components/credentialsResolverList'
import CredentialsSelection, { CredentialsSelectionProps } from '../../components/credentialsSelection'
import { useResolve } from '../../hooks/container'
import CredResolverStore from '../../store/credResolverStore'
import { CredentialResolverKind, CredResolverConfig } from '../../protos/kubeconfig_service_pb'
import UIStore from './UIStore'
import { RESOLVER_DEFAULT, RESOLVER_ENV, RESOLVER_IMDS, RESOLVER_PROFILE_FACTORY, RESOLVER_UNKNOWN } from './const'

// type ResolverValue = RESOLVER_DEFAULT | RESOLVER_IMDS | RESOLVER_ENV | string <- (profile)
type CredResolverItem = CredResolverConfig.AsObject & { resolverValue: string }

// TODO: make dedicated UI Store with Model, and use that.

export default observer(function CredResolver() {
  const credResolverStore = useResolve(CredResolverStore)
  const uiStore = useResolve(UIStore)

  // only calls one time on mount
  useEffect(() => {
    credResolverStore.fetchCredResolver()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // NOTE: if we use useMemo with observed, doesn't it render this component twice?
  // does it need a custom hook?
  const groups = useMemo(() => {
    const grouped = LINQ.from(uiStore.configEntites)
      .groupBy((entity) => entity.vendor)
      .select((g) => ({
        vendor: g.key(),
        items: g.toArray(),
      }))
      .toArray()

    return grouped
  }, [uiStore.configEntites])

  const options = useMemo<CredentialsSelectionProps['options']>(() => {
    const set = new Set<string>([RESOLVER_DEFAULT, RESOLVER_ENV, RESOLVER_IMDS])

    for (const {  } of credResolverStore.credResolvers) {
      set.add(RESOLVER_PROFILE_FACTORY(alias.accountalias))
    }

    return [
      ...[...set].map((name) => ({
        name,
      })),
      { name: RESOLVER_UNKNOWN },
    ]
  }, [credResolverStore.credResolvers])

  // TODO: make specific model for rendering?

  return (
    <Container maxWidth="md" sx={{ pt: '64px', pb: '64px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3">Credentials Resolver Setting</Typography>
      {/* TODO: calculate max height to support sticky */}
      <Box height="100%" overflow="hidden" sx={{ overflowY: 'auto' }}>
        <List sx={{ border: '1px solid red' }}>
          {groups.map(({ vendor, items }) => (
            <ListItem key={vendor} divider>
              <CredentialsResolverList vendor={vendor}>
                {items.map(({ accountId, value }) => (
                  <CredentialsSelection
                    key={accountId}
                    value={value}
                    accountId={accountId}
                    options={options}
                    onChange={() => {}}
                  />
                ))}
              </CredentialsResolverList>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  )
})
