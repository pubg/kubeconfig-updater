import { Box, ListItem, SelectChangeEvent, styled, Typography } from '@mui/material'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useResolve } from '../../../hooks/container'
import CredResolverStore from '../../../store/credResolverStore'
import ObservedCredResolverConfig from '../credResolverConfig'
import CredResolverConfigStatusIndicator from './credResolverConfigStatusIndicator'
import ProfileSelection, { ProfileSelectionOption } from './profileSelection'

const Container = styled(ListItem)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  }
})

export interface CredResolverListItemProps {
  config: ObservedCredResolverConfig
  getOptions: () => ProfileSelectionOption[]
}

export default observer(function CredResolverConfigListItem({ config, getOptions }: CredResolverListItemProps) {
  const credResolverStore = useResolve(CredResolverStore)

  const accountId = config.accountid
  const value = config.currentValue

  // do I have to use useMemo and useCallback for option + filtering?

  const optionFilterFunc = (option: ProfileSelectionOption) => {
    const { profile } = option
    if (!profile) {
      return true
    }

    if (profile.infravendor !== config.infravendor) {
      return false
    }

    // MFA profile's accountid is empty string
    if (profile.accountid !== '' && profile.accountid !== config.accountid) {
      return false
    }

    return true
  }

  const options = getOptions().filter(optionFilterFunc)

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
        <ProfileSelection value={value} options={options} onChange={onChange} />
      </Box>
    </Container>
  )
})
