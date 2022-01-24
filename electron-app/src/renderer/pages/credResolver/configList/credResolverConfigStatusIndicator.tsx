import { observer } from 'mobx-react-lite'
import { CircularProgress, Tooltip } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import ObservedCredResolverConfig from '../credResolverConfig'
import { ResultCode } from '../../../protos/common_pb'
import { Payload } from '../../../store/credResolverStore'

interface ConfigStatusViewProps {
  payload: Payload | null
  size: string
}

export default observer(function ConfigStatusView({ payload, size }: ConfigStatusViewProps) {
  if (!payload) {
    return <></>
  }

  const icon = (() => {
    if (!payload.resolved) {
      return <CircularProgress size={size} />
    }

    switch (payload.data?.resultCode) {
      case ResultCode.SUCCESS:
        return <DoneIcon color="success" />

      default:
        return <ErrorIcon color="error" />
    }
  })()

  let tooltipTitle = ''

  if (payload.data?.resultCode === ResultCode.SUCCESS) {
    tooltipTitle = 'OK'
  } else {
    tooltipTitle = payload.data?.message ?? 'unknown error'
  }

  return (
    <Tooltip title={tooltipTitle} sx={{ width: size, height: size }}>
      {icon}
    </Tooltip>
  )
})
