import { Box, IconButton, ListItem, SelectChangeEvent, styled, Tooltip, Typography } from '@mui/material'
import { ClearOutlined } from '@mui/icons-material'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useResolve } from '../../../hooks/container'
import CredResolverStore, { Payload } from '../../../store/credResolverStore'
import ObservedCredResolverConfig from '../credResolverConfig'
import CredResolverConfigStatusIndicator from './credResolverConfigStatusIndicator'
import ProfileSelection, { ProfileSelectionOption } from './profileSelection'
import { ValueWithPayload } from '../../../types/payloadMap'

const Container = styled(ListItem)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  }
})

export interface CredResolverListItemProps {
  config: ValueWithPayload<ObservedCredResolverConfig, Payload>
  getOptions: () => ProfileSelectionOption[]
}

export default observer(function CredResolverConfigListItem({
  config: configWithPayload,
  getOptions,
}: CredResolverListItemProps) {
  const credResolverStore = useResolve(CredResolverStore)

  const { payload, value: config } = configWithPayload

  const accountId = config.accountid

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

  const onDeleteClicked = () => {
    // FIXME: why it only requires accountId, not vendor???
    credResolverStore.deleteCredResolver(config.accountid)
  }

  const selectionTooltip = '해당 계정에 사용할 프로필 이름입니다'

  return (
    <Container>
      <Typography>{accountId}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <CredResolverConfigStatusIndicator payload={payload} size="32px" />
        <Tooltip title={selectionTooltip} placement="top" enterDelay={1000}>
          <div>
            <ProfileSelection value={config.accountid} options={options} onChange={onChange} />
          </div>
        </Tooltip>
        {/* delete item button (X) */}
        <IconButton onClick={onDeleteClicked}>
          <ClearOutlined />
        </IconButton>
      </Box>
    </Container>
  )
})
