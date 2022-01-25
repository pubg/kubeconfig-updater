import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List } from '@mui/material'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import ClusterRegisterStore from '../../../store/clusterRegisterStore'
import { ItemData } from './types'
import { useResolve } from '../../../hooks/container'
import RegListItem from './regListItem'
import { useReaction } from '../../../hooks/mobx'
import SnackbarStore from '../../../store/snackbarStore'

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
  const snackbarStore = useResolve(SnackbarStore)

  const [open, setOpen] = useState(false)
  const [canceled, setCanceled] = useState(false)

  const onOpen = () => {
    setOpen(true)
    setCanceled(false)
  }

  useReaction(() => store.items, onOpen)

  // NOTE: re-rendering list happens due to here
  // but I'm not going to memoize each list item before unless rendering is laggy (YAGNI?)
  const canClose = store.state === 'ready'

  const onClose = () => {
    if (canClose) {
      setOpen(false)
    }
  }

  const onCanceled = () => {
    if (!canceled) {
      store.cancelRequest()
      snackbarStore.push({
        key: 'cluster-regsiter-cancel',
        message: 'cluster regstration canceled',
        options: {
          variant: 'warning',
        },
      })

      setCanceled(true)
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
        <Button onClick={onCanceled}>Cancel</Button>
        <Button disabled={!canClose} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})
