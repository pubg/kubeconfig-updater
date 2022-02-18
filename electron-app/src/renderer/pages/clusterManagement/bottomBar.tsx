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

  const onButonClicked = useCallback(
    (mode: 'register' | 'unregister') => {
      // clear items after request
      const { selectedItems } = store
      store.resetSelection()

      // NOTE: should this exists in here?
      registerStore
        .request(
          selectedItems.map((item) => ({
            clusterName: item.data.metadata.clustername,
            accountId: item.data.metadata.credresolverid,
          })),
          mode
        )
        .then(() => metadataStore.fetchMetadata())
        .catch(browserLogger.error)
    },
    [metadataStore, registerStore, store]
  )

  return (
    <Stack direction="row" width="100%" alignItems="center" gap="16px" marginLeft="32px">
      <Button variant="outlined" disabled={isProcessing} onClick={() => onButonClicked('register')}>
        Register Selected
      </Button>
      <Button variant="outlined" disabled={isProcessing} onClick={() => onButonClicked('unregister')}>
        UnRegister Selected
      </Button>
      {/* on ready (selecting items...) */}
      <Typography>{store.selection.count} Clusters Selected</Typography>
    </Stack>
  )
})
