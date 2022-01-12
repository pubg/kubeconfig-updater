import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  List,
  ListItem,
  Paper,
  Popper,
  Tooltip,
  useTheme,
} from '@mui/material'
import _ from 'lodash'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { genAccountId, genClusterName } from '../../../mock/data/metadata'
import ClusterRegisterStore from '../../../store/clusterRegisterStore'
import { ResultCode } from '../../../protos/common_pb'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratorReturnType<T extends Iterator<any>> = T extends Iterator<infer V> ? V : never
type Item = GeneratorReturnType<ClusterRegisterStore['items']>

const sampleAccountIds: string[] = _.times(4, genAccountId)

function genItem(resolved?: boolean, error?: boolean): Item {
  const item = {
    value: { accountId: _.sample(sampleAccountIds), clusterName: genClusterName() },
    payload: {
      resolved,
      response: {
        resultCode: error ? ResultCode.FAILED : ResultCode.SUCCESS,
        message: error ? 'error message' : 'OK',
      },
    },
  }

  return item as Item
}

const sampleData: Item[] = [
  ..._.times(4, () => genItem(true)),
  ..._.times(2, () => genItem(true, true)),
  genItem(false),
  ..._.times(7, () => genItem()),
]

export default observer(function RegistrationProgressModal() {
  const Icon = ({ item }: { item: Item }) => {
    const { payload } = item
    if (!payload || payload?.resolved === undefined) {
      return <></>
    }

    if (!payload.resolved) {
      return <CircularProgress size="100%" />
    }

    if (payload.response?.resultCode === ResultCode.SUCCESS) {
      return <CheckIcon width="100%" height="100%" color="success" />
    }

    return <ClearIcon width="100%" height="100%" color="error" />
  }

  const ItemView = ({ item }: { item: Item }) => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const theme = useTheme()

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
            {/* <CircularProgress size="1em" /> */}

            {/* cluster name */}
            <Tooltip title={item.value.clusterName}>
              <DialogContentText noWrap>{item.value.clusterName}</DialogContentText>
            </Tooltip>
          </Box>

          {item.payload?.response?.resultCode !== ResultCode.SUCCESS && (
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
  }

  return (
    <Dialog open fullWidth>
      <DialogTitle>Registration status</DialogTitle>
      <DialogContent dividers>
        <List>
          {sampleData.map((item) => (
            <ItemView key={item.value.clusterName + item.value.accountId} item={item} />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
})
