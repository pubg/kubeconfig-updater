import { Stack, Switch, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useResolve } from '../../hooks/container'
import { UIConfigStore } from '../../store/uiConfigStore'

export default observer(function ClientConfig() {
  const configUIStore = useResolve(UIConfigStore)
  const [fullScreenState, setFullScreenState] = useState(configUIStore.fullScreenOnStartup)

  const onFullScreenToggle = useCallback(
    (value: boolean) => {
      configUIStore.fullScreenOnStartup = value
      setFullScreenState(configUIStore.fullScreenOnStartup)
    },
    [configUIStore]
  )

  return (
    <Stack>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">FullScreen on start</Typography>
        <Switch checked={fullScreenState} onChange={(_, checked) => onFullScreenToggle(checked)} />
      </Stack>
    </Stack>
  )
})
