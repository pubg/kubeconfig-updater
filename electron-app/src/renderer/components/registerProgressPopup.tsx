import { ProgressIndicator } from '@fluentui/react'
import { emphasize, Paper, Snackbar, SnackbarContent, SnackbarProps, styled, useTheme } from '@mui/material'
import { snackbarContentClasses, SnackbarContentClassKey } from '@mui/material/SnackbarContent'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import { useAutorun } from '../hooks/mobx'
import { useContext } from './clusterRegisterRequester'

export default observer(function RegisterProgressPopup() {
  const requester = useContext()

  const [open, setOpen] = useState(false)
  const [hideDuration, setHideDuration] = useState<number | null>(null)
  const desiredAutoHideDuration = 3000 // 3 second

  const description = useMemo(() => {
    if (requester.currentItem) {
      return `[${requester.processedCount}/${requester.length}] adding cluster: ${requester.currentItem?.clusterName}`
    } else {
      return `registered ${requester.length} clusters.`
    }
  }, [requester.currentItem?.clusterName, requester.length, requester.processedCount])

  const percentageComplete = useMemo<number>(() => {
    return requester.processedCount / (requester.length || 1)
  }, [requester.length, requester.processedCount])

  useAutorun(() => {
    if (requester.state === 'processing') {
      setHideDuration(null)
      setOpen(true)
    } else {
      setHideDuration(desiredAutoHideDuration)
    }
  })

  const onClose = useCallback<NonNullable<SnackbarProps['onClose']>>((e, reason) => {
    if (reason === 'timeout') {
      setOpen(false)
      setHideDuration(null)
    }
  }, [])


  // theme
  const theme = useTheme()
  const emphasis = theme.palette.mode === 'light' ? 0.8 : 0.98
  const backgroundColor = emphasize(theme.palette.background.default, emphasis)

  // how to use global css?
  return (
    <Snackbar
      // open={open}
      open
      autoHideDuration={hideDuration}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      onClose={onClose}
    >
      <Paper elevation={4} sx={{ margin: '8px 16px 8px 16px', backgroundColor }}>
        <ProgressIndicator
          label="Register Clusters..."
          description={description}
          percentComplete={percentageComplete}
        />
      </Paper>
    </Snackbar>
  )
})
