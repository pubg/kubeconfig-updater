import { Box, ListItem, SelectChangeEvent, styled, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useResolve } from '../../../hooks/container'
import CredResolverStore from '../../../store/credResolverStore'
import ObservedCredResolverConfig from '../credResolverConfig'
import CredResolverConfigStatusIndicator from './credResolverConfigStatusIndicator'
import ProfileSelection from './profileSelection'

const Container = styled(ListItem)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  }
})

type Option = {
  key: string
  label: string
  inactive?: boolean
}

export interface CredResolverListItemProps {
  config: ObservedCredResolverConfig
  getOptions: () => Option[]
}

export default observer(function CredResolverConfigListItem({ config, getOptions }: CredResolverListItemProps) {
  const credResolverStore = useResolve(CredResolverStore)

  const accountId = config.accountid
  const value = config.currentValue

  const onChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const newValue = e.target.value
      config.changeConfigType(newValue)

      credResolverStore.setCredResolver(config)
    },
    [config, credResolverStore]
  )

  return (
    <Container>
      <Typography>{accountId}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <CredResolverConfigStatusIndicator config={config} size="32px" />
        <ProfileSelection value={value} getOptions={getOptions} onChange={onChange} />
      </Box>
    </Container>
  )
})
