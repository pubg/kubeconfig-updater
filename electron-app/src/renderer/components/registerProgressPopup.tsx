import { ProgressIndicator } from '@fluentui/react'
import { Paper, Snackbar, SnackbarCloseReason, SnackbarContent, SnackbarProps, Typography } from '@mui/material'
import { autorun, reaction, when } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useState } from 'react'
import logger from '../../logger/logger'
import { useAutorun } from '../hooks/mobx'
import { useContext } from './clusterRegisterRequester'

export default observer(function RegisterProgressPopup() {
  const requester = useContext()

  const [open, setOpen] = useState(false)
  const [hideDuration, setHideDuration] = useState<number | null>(null)
  const desiredAutoHideDuration = 3000 // 3 second

  const description = useMemo(() => {
    const msg = `[${requester.processedCount}/${requester.length}] adding cluster: ${requester.currentItem?.clusterName}`

    return msg
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

  return (
    <Snackbar
      open={open}
      // open
      autoHideDuration={hideDuration}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      onClose={onClose}
    >
      <Paper elevation={4}>
        <ProgressIndicator
          label="Register Clusters..."
          description={description}
          percentComplete={percentageComplete}
        />
      </Paper>
    </Snackbar>
  )
})
