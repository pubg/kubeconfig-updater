import { Button, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import * as clusterMetadataStore from './clusterMetadataStore'
import * as ClusterMetadataRequester from '../../components/clusterMetadataRequester'
import * as ClusterRegisterRequester from '../../components/clusterRegisterRequester'
import logger from '../../../logger/logger'

export default observer(function BottomBar() {
  const store = clusterMetadataStore.useStore()
  const metadataRequester = ClusterMetadataRequester.useContext()
  const registerRequester = ClusterRegisterRequester.useContext()

  // QUESTION: I'm using mobX for (reactive) state machine, should I use react context + mobX store?
  // share requester globally or local?
  // const requester = ClusterRegisterRequester.useStore()

  const [isProcessing, setIsProcessing] = useState(false)

  const onRegisterAllClicked = useCallback(() => {
    ;(async () => {
      // clear items after request
      const { selectedItems } = store
      store.resetSelection()

      await registerRequester.request(
        selectedItems.map((item) => ({
          clusterName: item.data.metadata.clustername,
          accountId: item.data.metadata.credresolverid,
        }))
      )

      await metadataRequester.fetchMetadata()
    })()
  }, [metadataRequester, registerRequester, store])

  useEffect(() => {
    if (metadataRequester.state !== 'ready') {
      return setIsProcessing(true)
    }

    if (registerRequester.state === 'processing') {
      return setIsProcessing(true)
    }

    return setIsProcessing(false)
  }, [metadataRequester.state, registerRequester.state])

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px">
      <Button variant="outlined" disabled={isProcessing} onClick={onRegisterAllClicked}>
        Register ALL
      </Button>
      {/* on ready (selecting items...) */}
      <Typography>{store.selection.count} Clusters Selected.</Typography>
      {isProcessing && (
        <Typography>
          processing {registerRequester.processedCount} / {registerRequester.length}
        </Typography>
      )}
    </Stack>
  )
})
