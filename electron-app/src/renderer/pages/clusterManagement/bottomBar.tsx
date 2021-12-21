import { Button, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import * as clusterMetadataStore from './clusterMetadataStore'
import * as ClusterMetadataRequester from '../../components/clusterMetadataRequester'
import * as ClusterRegisterRequester from '../../components/clusterRegisterRequester'

export default observer(function BottomBar() {
  const store = clusterMetadataStore.useStore()
  const metadataRequester = ClusterMetadataRequester.useContext()
  const registerRequester = ClusterRegisterRequester.useContext()

  // QUESTION: I'm using mobX for (reactive) state machine, should I use react context + mobX store?
  // share requester globally or local?
  // const requester = ClusterRegisterRequester.useStore()

  const [showSelection, setShowSelection] = useState(true)

  const onRegisterAllClicked = useCallback(() => {
    registerRequester.request(
      store.selectedItems.map((item) => ({
        clusterName: item.data.metadata.clustername,
        accountId: item.data.metadata.credresolverid,
      }))
    )

    // clear items after request
    store.resetSelection()

    setShowSelection(false)
  }, [registerRequester, store])

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px">
      <Button
        variant="outlined"
        disabled={registerRequester.state === 'processing' || metadataRequester.state === 'fetch'}
        onClick={onRegisterAllClicked}
      >
        Register ALL
      </Button>
      {/* on ready (selecting items...) */}
      {showSelection && <Typography>{store.selection.count} Clusters Selected.</Typography>}
    </Stack>
  )
})
