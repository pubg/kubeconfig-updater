import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List } from '@mui/material'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import ClusterRegisterStore from '../../../store/clusterRegisterStore'
import { ItemData } from './types'
import { useResolve } from '../../../hooks/container'
import RegListItem from './regListItem'
import { useReaction } from '../../../hooks/mobx'

const RegListView = observer(({ items }: { items: ItemData[] }) => {
  const hash = (item: ItemData) => `${item.value.accountId}#${item.value.clusterName}`

  return (
    <List>
      {items.map((item) => (
        <RegListItem key={hash(item)} item={item} />
      ))}
    </List>
  )
})

export default observer(function RegStatusModal() {
  const store = useResolve(ClusterRegisterStore)

  const [open, setOpen] = useState(false)

  useReaction(
    () => store.items,
    () => setOpen(true)
  )

  // NOTE: re-rendering list happens due to here
  // but I'm not going to memoize each list item before unless rendering is laggy (YAGNI?)
  const canClose = store.processedCount === store.length

  const onClose = () => {
    if (canClose) {
      setOpen(false)
    }
  }

  const items = [...store.items]

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>Registration status</DialogTitle>
      <DialogContent dividers>
        <RegListView items={items} />
      </DialogContent>
      <DialogActions>
        <Button disabled={!canClose} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})
