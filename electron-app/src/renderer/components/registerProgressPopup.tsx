import {
  Box,
  emphasize,
  LinearProgress,
  Paper,
  Snackbar,
  SnackbarProps,
  styled,
  Theme,
  Typography,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import { sprintf } from 'sprintf-js'
import { useResolve } from '../hooks/container'
import { useAutorun } from '../hooks/mobx'
import ClusterRegisterStore from '../store/clusterRegisterStore'

// reserved for future use
/*
function getInvertedBackgroundColor(theme: Theme) {
  const emphasis = theme.palette.mode === 'light' ? 0.8 : 0.98
  const backgroundColor = emphasize(theme.palette.background.default, emphasis)

  return backgroundColor
}
*/

const RegisterProgressPopupRoot = styled(Paper, {
  name: 'RegisterProgressPopupRoot',
})(({ theme }) => {
  return {
    ...theme.typography.body2,
    padding: '8px 16px 8px 16px',
    width: '100%',
  }
})

const RegisterProgressTitle = styled(Typography, {
  name: 'RegisterProgressTitle',
})(({ theme }) => {
  return {}
})

export default observer(function RegisterProgressPopup() {
  const registerStore = useResolve(ClusterRegisterStore)

  const [open, setOpen] = useState(false)
  const [hideDuration, setHideDuration] = useState<number | null>(null)
  const desiredAutoHideDuration = 1000 // ms

  const percentComplete = useMemo<number>(() => {
    return (registerStore.processedCount / (registerStore.length || 1)) * 100
  }, [registerStore.length, registerStore.processedCount])

  useAutorun(() => {
    if (registerStore.state === 'processing') {
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
      sx={{ width: '24vw', minWidth: '280px' }}
    >
      <RegisterProgressPopupRoot elevation={3}>
        <RegisterProgressTitle>Register in progress...</RegisterProgressTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percentComplete} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {sprintf('%01d%%', percentComplete)}
          </Typography>
        </Box>
      </RegisterProgressPopupRoot>
    </Snackbar>
  )
})
