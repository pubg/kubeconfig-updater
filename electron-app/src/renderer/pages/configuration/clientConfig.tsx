import { Stack, Switch, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'

export default observer(function ClientConfig() {
  const [fullScreenState, setFullScreenState] = useState(false)
  const store = clientConfigStore

  useEffect(() => {
    const destructor = clientConfigStore.onDidChange('maximizeOnStart', (value) => {
      setFullScreenState(value as boolean)
    })

    return () => {
      destructor()
    }
  }, [])

  const onFullScreenToggle = useCallback(
    (value: boolean) => {
      store.set('maximizeOnStart', value)
    },
    [store]
  )

  return (
    <Stack>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">FullScreen on start</Typography>
        <Switch value={fullScreenState} onChange={(_, checked) => onFullScreenToggle(checked)} />
      </Stack>
    </Stack>
  )
})
