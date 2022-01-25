import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  DialogContentText,
  Fade,
  ListItem,
  Paper,
  Popper,
  Tooltip,
  useTheme,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { ResultCode } from '../../../protos/common_pb'
import { ItemData } from './types'

interface RegListItemProps {
  item: ItemData
}

const Icon = observer(({ item }: RegListItemProps) => {
  const { payload } = item
  if (!payload || payload.resolved === undefined) {
    return <></>
  }

  if (!payload.resolved) {
    return <CircularProgress size="100%" />
  }

  if (payload.response?.resultCode === ResultCode.SUCCESS) {
    return <CheckIcon width="100%" height="100%" color="success" />
  }
  if (payload.response?.resultCode === ResultCode.CANCELED) {
    return <WarningAmberIcon width="100%" height="100%" color="warning" />
  }

  return <ClearIcon width="100%" height="100%" color="error" />
})

export default observer(function RegListItem({ item }: RegListItemProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const theme = useTheme()

  const resultCode = item.payload?.response?.resultCode

  return (
    <ListItem>
      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" gap="16px">
        <Box display="flex" alignItems="center" gap="12px">
          {/* status icon */}
          <Tooltip title={item.payload?.response?.message ?? ''}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="1em"
              height="1em"
              // sx={{ backgroundColor: 'red' }}
            >
              <Icon item={item} />
            </Box>
          </Tooltip>

          {/* cluster name */}
          <Tooltip title={item.value.clusterName}>
            <DialogContentText noWrap>{item.value.clusterName}</DialogContentText>
          </Tooltip>
        </Box>

        {resultCode !== undefined && resultCode !== ResultCode.SUCCESS && (
          <Button size="small" variant="text" onClick={(e) => setAnchorEl(e.currentTarget)}>
            reason
          </Button>
        )}

        {/* TODO: add popper arrow */}
        <Popper open={!!anchorEl} anchorEl={anchorEl} style={{ zIndex: theme.zIndex.modal + 1 }} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper elevation={5} sx={{ mt: '8px' }}>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <DialogContentText>{item.payload?.response?.message}</DialogContentText>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ListItem>
  )
})
