import { SxProps } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import Progress from '../../components/Progress'
import { useResolve } from '../../hooks/container'
import ClusterMetadataStore from '../../store/clusterMetadataStore'

const sx: SxProps = {
  position: 'absolute',
  width: '320px',
  top: '16px',
  left: '50%',
  transform: 'translate(-50%)',
  borderRadius: '32px',
} as const

function ProgressSnackbar() {
  const clusterStore = useResolve(ClusterMetadataStore)

  const title = useMemo(() => {
    switch (clusterStore.state) {
      case 'fetch':
        return 'Fetching Clusters in Progress...'

      case 'in-sync':
        return 'Sync Clusters in Progress...'

      default:
        return 'Undefined SwitchCase Return'
    }
  }, [clusterStore.state])

  const open = useMemo(() => {
    return clusterStore.state !== 'ready'
  }, [clusterStore.state])

  return <Progress open={open} title={title} sx={sx} />
}

export default observer(ProgressSnackbar)
