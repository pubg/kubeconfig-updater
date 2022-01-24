import { Button, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import ClusterManagementUIStore from './UIStore/ClusterManagementUIStore'
import { useResolve } from '../../hooks/container'
import ClusterMetadataStore from '../../store/clusterMetadataStore'
import ClusterRegisterStore from '../../store/clusterRegisterStore'
import browserLogger from '../../logger/browserLogger'

export default observer(function BottomBar() {
  const store = useResolve(ClusterManagementUIStore)
  const metadataStore = useResolve(ClusterMetadataStore)
  const registerStore = useResolve(ClusterRegisterStore)

  const isProcessing = useMemo(() => {
    return metadataStore.state !== 'ready' || registerStore.state !== 'ready'
  }, [metadataStore.state, registerStore.state])

  const onRegisterAllClicked = useCallback(() => {
    // clear items after request
    const { selectedItems } = store
    store.resetSelection()

    // NOTE: should this exists in here?
    registerStore
      .request(
        selectedItems.map((item) => ({
          clusterName: item.data.metadata.clustername,
          accountId: item.data.metadata.credresolverid,
        }))
      )
      .then(() => metadataStore.fetchMetadata())
      .catch(browserLogger.error)
  }, [metadataStore, registerStore, store])

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px" marginLeft="32px">
      <Button variant="outlined" disabled={isProcessing} onClick={onRegisterAllClicked}>
        Register Selected
      </Button>
      {/* on ready (selecting items...) */}
      <Typography>{store.selection.count} Clusters Selected.</Typography>
    </Stack>
  )
})
