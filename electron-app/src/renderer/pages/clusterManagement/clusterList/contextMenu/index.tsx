import { ClickAwayListener, ClickAwayListenerProps, List, ListItemButton, Popover } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ClusterMetadataItem } from '../../UIStore/types'
import JSONModal from './jsonModal'

export interface ContextMenuProps {
  item: ClusterMetadataItem | null
  position?: { top: number; left: number }
  onSelected: (value: string) => void
  onDismiss: ClickAwayListenerProps['onClickAway']
}

// TODO: refactor this to component? <- please
export default observer(function ContextMenu({ item, position, onSelected, onDismiss }: ContextMenuProps) {
  const [selected, setSelected] = useState('')

  const onItemSelectedFactory = (value: string) => () => {
    setSelected(value)
    onSelected(value)
  }

  return (
    <>
      <Popover anchorReference="anchorPosition" open={!!position} anchorPosition={position}>
        <ClickAwayListener onClickAway={onDismiss}>
          <List component="nav">
            <ListItemButton onClick={onItemSelectedFactory('INSPECT_JSON')}>Inspect JSON</ListItemButton>
          </List>
        </ClickAwayListener>
      </Popover>
      {/* refactor this */}
      {!!item && <JSONModal open={selected === 'INSPECT_JSON'} item={item.data} onClickAway={() => setSelected('')} />}
    </>
  )
})
