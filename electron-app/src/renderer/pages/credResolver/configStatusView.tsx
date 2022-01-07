import { observer } from 'mobx-react-lite'
import { CircularProgress, Tooltip } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import { ResultCode } from '../../protos/common_pb'
import { ObservedCredResolverConfig } from '../../store/credResolverStore'

interface ConfigStatusViewProps {
  config: ObservedCredResolverConfig
  size: string
}

export default observer(function ConfigStatusView({ config, size }: ConfigStatusViewProps) {
  if (config.setResponse === undefined || config.resolved === undefined) {
    return <></>
  }

  const { setResponse, resolved } = config

  const icon = (() => {
    if (!resolved) {
      return <CircularProgress size={size} />
    }

    switch (setResponse.resultCode) {
      case ResultCode.SUCCESS:
        return <DoneIcon color="success" />

      default:
        return <ErrorIcon color="error" />
    }
  })()

  let tooltipTitle = ''

  if (setResponse.resultCode === ResultCode.SUCCESS) {
    tooltipTitle = 'OK'
  } else {
    tooltipTitle = setResponse.message ?? 'unknown error'
  }

  return (
    <Tooltip title={tooltipTitle} sx={{ width: size, height: size }}>
      {icon}
    </Tooltip>
  )
})
