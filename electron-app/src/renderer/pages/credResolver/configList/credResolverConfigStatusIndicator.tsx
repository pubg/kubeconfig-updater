import { observer } from 'mobx-react-lite'
import { CircularProgress, Tooltip } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import ObservedCredResolverConfig from '../credResolverConfig'
import { ResultCode } from '../../../protos/common_pb'

interface ConfigStatusViewProps {
  config: ObservedCredResolverConfig
  size: string
}

export default observer(function ConfigStatusView({ config, size }: ConfigStatusViewProps) {
  const { response } = config

  if (!response) {
    return <></>
  }

  const icon = (() => {
    if (!response.resolved) {
      return <CircularProgress size={size} />
    }

    switch (response.data?.resultCode) {
      case ResultCode.SUCCESS:
        return <DoneIcon color="success" />

      default:
        return <ErrorIcon color="error" />
    }
  })()

  let tooltipTitle = ''

  if (response.data?.resultCode === ResultCode.SUCCESS) {
    tooltipTitle = 'OK'
  } else {
    tooltipTitle = response.data?.message ?? 'unknown error'
  }

  return (
    <Tooltip title={tooltipTitle} sx={{ width: size, height: size }}>
      {icon}
    </Tooltip>
  )
})
