import { Box, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { genAccountId, genClusterName } from '../../../mock/data/metadata'
import ClusterRegisterStore from '../../../store/clusterRegisterStore'
import styles from './dots.module.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratorReturnType<T extends Iterator<any>> = T extends Iterator<infer V> ? V : never
type Item = GeneratorReturnType<ClusterRegisterStore['items']>

const sampleAccountIds: string[] = _.times(4, genAccountId)

function genItem(): Item {
  const item = {
    value: { accountId: _.sample(sampleAccountIds), clusterName: genClusterName() },
    payload: {
      resolved: Math.random() > 0.5,
    },
  }

  return item as Item
}

const sampleData: Item[] = _.times(12, genItem)

export default observer(function RegistrationProgressModal() {
  const ItemView = ({ item }: { item: Item }) => {
    return (
      <div>
        <p className={styles.dots}>account: {item.value.accountId}</p>
      </div>
    )
  }

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>Registration status</DialogTitle>
      <DialogContent dividers>
        {sampleData.map((item) => (
          <ItemView key={item.value.clusterName + item.value.accountId} item={item} />
        ))}
      </DialogContent>
    </Dialog>
  )
})
