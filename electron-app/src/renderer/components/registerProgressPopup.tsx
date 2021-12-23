import {
  IButtonStyles,
  IProgressIndicatorStyles,
  PartialTheme,
  ProgressIndicator,
  ThemeProvider,
} from '@fluentui/react'
import { AzureThemeDark } from '@fluentui/azure-themes'
import { emphasize, Paper, Snackbar, SnackbarContent, SnackbarProps, styled, Theme, useTheme } from '@mui/material'
import { snackbarContentClasses, SnackbarContentClassKey } from '@mui/material/SnackbarContent'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import { dark } from '@mui/material/styles/createPalette'
import logger from '../../logger/logger'
import { useAutorun } from '../hooks/mobx'
import { useContext } from './clusterRegisterRequester'

function getInvertedBackgroundColor(theme: Theme) {
  const emphasis = theme.palette.mode === 'light' ? 0.8 : 0.98
  const backgroundColor = emphasize(theme.palette.background.default, emphasis)

  return backgroundColor
}

const RegisterProgressPopupRoot = styled(Paper, {
  name: 'RegisterProgressPopupRoot',
})(({ theme }) => {
  const backgroundColor = getInvertedBackgroundColor(theme)

  return {
    ...theme.typography.body2,
    padding: '8px 16px 8px 16px',
    backgroundColor,
    width: '100%',
  }
})

export default observer(function RegisterProgressPopup() {
  const requester = useContext()

  const [open, setOpen] = useState(false)
  const [hideDuration, setHideDuration] = useState<number | null>(null)
  const desiredAutoHideDuration = 3000 // 3 second

  const description = useMemo(() => {
    if (requester.currentItem) {
      return `[${requester.processedCount}/${requester.length}] adding cluster: ${requester.currentItem?.clusterName}`
    }

    return `registered ${requester.length} clusters.`
  }, [requester.currentItem, requester.length, requester.processedCount])

  const percentComplete = useMemo<number>(() => {
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

  const theme = useTheme()
  const progressIndicatorTheme = useMemo(() => {
    const backgroundColor = getInvertedBackgroundColor(theme)

    const partialTheme: PartialTheme = {
      components: {
        ProgressIndicator: {
          styles: {
            root: {
              backgroundColor,
            },
            itemName: {
              // ...theme.typography.button,
              color: theme.palette.getContrastText(backgroundColor),
            },
          } as IProgressIndicatorStyles,
        },
      },
    }
    return partialTheme
  }, [theme])

  logger.debug(typeof AzureThemeDark.components?.ProgressIndicator.styles)

  // how to use global css?
  return (
    <Snackbar
      // open={open}
      open
      autoHideDuration={hideDuration}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      onClose={onClose}
      sx={{ width: '24vw' }}
    >
      <RegisterProgressPopupRoot>
        <ThemeProvider theme={progressIndicatorTheme}>
          <ProgressIndicator
            label="Register in progress..."
            // description={description}
            percentComplete={percentComplete}
          />
        </ThemeProvider>
      </RegisterProgressPopupRoot>
    </Snackbar>
  )
})
