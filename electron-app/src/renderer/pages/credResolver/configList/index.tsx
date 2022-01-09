import { List, SelectChangeEvent } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import LINQ from 'linq'
import { toJS } from 'mobx'
import { useResolve } from '../../../hooks/container'
import ObservedCredResolverConfig from '../credResolverConfig'
import UIStore from '../uiStore'
import CredResolverConfigList from './credResolverConfigList'
import CredResolverConfigListItem from './credResolverConfigListItem'
import browserLogger from '../../../logger/browserLogger'

export default observer(() => {
  const uiStore = useResolve(UIStore)
  const { credResolverStore, options } = uiStore

  // don't use useCallback.
  // it's updated by mobx
  const getOptions = () => options

  const groups = useMemo<{ vendor: string; configs: ObservedCredResolverConfig[] }[]>(() => {
    const grouped = LINQ.from(credResolverStore.credResolvers)
      .groupBy((credResolver) => credResolver.infravendor)
      .select((g) => ({
        vendor: g.key(),
        configs: g.toArray().sort((a, b) => a.accountid.localeCompare(b.accountid)),
      }))
      .orderBy(({ vendor }) => vendor)
      .toArray()

    return grouped
  }, [credResolverStore.credResolvers])

  return (
    // list grouped by vendor
    <List sx={{ border: '1px solid red' }}>
      {uiStore.state === 'ready' &&
        groups.map(({ vendor, configs }) => (
          // list by each config item
          <CredResolverConfigList key={vendor} vendor={vendor}>
            {configs.map((config) => (
              <CredResolverConfigListItem config={config} key={config.accountid} getOptions={getOptions} />
            ))}
          </CredResolverConfigList>
        ))}
    </List>
  )
})
