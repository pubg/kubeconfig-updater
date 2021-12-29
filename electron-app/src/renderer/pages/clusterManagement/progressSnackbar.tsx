import { SxProps } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import Progress from '../../components/Progress'
import * as MetadataRequester from '../../components/clusterMetadataRequester'

const sx: SxProps = {
  position: 'absolute',
  width: '320px',
  top: '16px',
  left: '50%',
  transform: 'translate(-50%)',
  borderRadius: '32px',
} as const

function ProgressSnackbar() {
  const requester = MetadataRequester.useContext()

  const title = useMemo(() => {
    switch (requester.state) {
      case 'fetch':
        return 'fetching cluster in progress...'

      case 'in-sync':
        return 'cluster sync in progress...'

      default:
        return 'placeholder'
    }
  }, [requester.state])

  const open = useMemo(() => {
    return requester.state !== 'ready'
  }, [requester.state])

  return <Progress open={open} title={title} sx={sx} />
}

export default observer(ProgressSnackbar)
