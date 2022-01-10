import { Box, ClickAwayListener, Dialog, TextField } from '@mui/material'
import ReactJson from 'react-json-view'
import { ClusterMetadata } from '../../../UIStore/types'

export interface JSONModalProps {
  open: boolean
  item: ClusterMetadata
  onClickAway: () => void
}

export default function JSONModal({ open, onClickAway, item }: JSONModalProps) {
  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <ClickAwayListener onClickAway={onClickAway} mouseEvent="onMouseDown">
        <Box sx={{ backgroundColor: 'white', padding: '8px' }}>
          <Box>
            <ReactJson src={item} theme="harmonic" />
          </Box>
        </Box>
      </ClickAwayListener>
    </Dialog>
  )
}
