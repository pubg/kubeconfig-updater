import { observer } from 'mobx-react-lite'
import { CircularProgress, Tooltip } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import { ResultCode } from '../../protos/common_pb'
import { ObservedCredResolverConfig } from '../../store/credResolverStore'

interface ConfigStatusViewProps {
  config: ObservedCredResolverConfig
}

export default observer(function ConfigStatusView({ config }: ConfigStatusViewProps) {
  const { setResponse, resolved } = config

  if (!setResponse || resolved === undefined) {
    return <></>
  }

  const icon = (() => {
    if (!resolved) {
      return <CircularProgress />
    }

    switch (setResponse.resultCode) {
      case ResultCode.SUCCESS:
        return <DoneIcon />

      default:
        return <ErrorIcon />
    }
  })()

  return <Tooltip title="tooltip">{icon}</Tooltip>
})
