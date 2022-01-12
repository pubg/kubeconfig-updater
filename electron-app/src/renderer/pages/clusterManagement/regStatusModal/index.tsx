import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, List } from '@mui/material'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { Item } from 'electron'
import { useState } from 'react'
import { genAccountId, genClusterName } from '../../../mock/data/metadata'
import ClusterRegisterStore from '../../../store/clusterRegisterStore'
import { ResultCode } from '../../../protos/common_pb'
import { ItemData } from './types'
import { useResolve } from '../../../hooks/container'
import RegListItem from './regListItem'
import { useAutorun, useReaction } from '../../../hooks/mobx'

const sampleAccountIds: string[] = _.times(4, genAccountId)

function genItem(resolved?: boolean, error?: boolean): ItemData {
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

  return item as ItemData
}

const sampleData: ItemData[] = [
  ..._.times(4, () => genItem(true)),
  ..._.times(2, () => genItem(true, true)),
  genItem(false),
  ..._.times(7, () => genItem()),
]

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

  const canClose = store.processedCount === store.length

  const onClose = () => {
    setOpen(false)
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
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
})
