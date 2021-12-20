import { Button, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import * as clusterMetadataStore from './clusterMetadataStore'
import { ClusterRegisterRequester } from './clusterRegisterRequester'

export default observer(function BottomBar() {
  const store = clusterMetadataStore.useStore()

  // QUESTION: I'm using mobX for (reactive) state machine, should I use react context + mobX store?
  // share requester globally or local?
  // const requester = ClusterRegisterRequester.useStore()

  const [requester, setRequester] = useState<ClusterRegisterRequester | null>(null)
  const [showSelection, setShowSelection] = useState(true)

  const onRegisterAllClicked = useCallback(() => {
    const newRequester = new ClusterRegisterRequester()
    setRequester(newRequester)

    newRequester.request(store.selectedItems.map((item) => ({ clusterName: item.data.metadata.clustername, accountId: item.data.metadata.credresolverid })))

    // clear items after request
    store.setSelectedItems([])

    setShowSelection(false)
  }, [store])

  // TODO: refactor this
  useEffect(() => {
    if (requester?.state === 'finished' && store.selectedItems.length > 0) {
      setShowSelection(true)
    }
  }, [requester?.state, store.selectedItems.length])

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px">
      <Button variant="outlined" disabled={store.state === 'fetching' || (!!requester && requester.state !== 'ready')} onClick={onRegisterAllClicked}>
        Register ALL
      </Button>
      {/* on ready (selecting items...) */}
      {showSelection && <Typography>{store.selectedItems.length} Clusters Selected.</Typography>}

      {/* when request is processing */}
      {!showSelection && requester && requester.state === 'processing' && (
        <Typography>
          Processing {requester.processedCount} of {requester.length}...
        </Typography>
      )}

      {/* when request is completed */}
      {!showSelection && requester && requester.state === 'finished' && <Typography>Registered {requester.length} clusters...</Typography>}
    </Stack>
  )
})
