import { Stack, Switch, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'

export default observer(function ClientConfig() {
  const store = clientConfigStore
  const [fullScreenState, setFullScreenState] = useState(store.get('maximizeOnStart', true) as boolean)

  console.log(store)

  useEffect(() => {
    const destructor = store.onDidChange('maximizeOnStart', (value) => {
      setFullScreenState(value as boolean)
    })

    return () => {
      destructor()
    }
  }, [store])

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
        <Switch checked={fullScreenState} onChange={(_, checked) => onFullScreenToggle(checked)} />
      </Stack>
    </Stack>
  )
})
