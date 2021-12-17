import { Button, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from './clusterMetadataStore'

function BottomBar() {
  const store = useStore()

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px">
      <Button variant="outlined">Register ALL</Button>
      <Typography>{store.selectedItems.length} Clusters Selected.</Typography>
    </Stack>
  )
}

export default observer(BottomBar)
