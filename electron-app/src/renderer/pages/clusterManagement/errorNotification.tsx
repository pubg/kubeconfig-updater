import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useResolve } from '../../hooks/container'
import { useListen } from '../../hooks/event'
import browserLogger from '../../logger/browserLogger'
import ClusterRegisterStore from '../../store/clusterRegisterStore'
import SnackbarStore from '../../store/snackbarStore'

export default observer(function ErrorNotification() {
  const snackbarStore = useResolve(SnackbarStore)
  const registerStore = useResolve(ClusterRegisterStore)

  useListen(registerStore.errorEvent, (err) => {
    browserLogger.debug('got register error event')
    snackbarStore.push({
      key: dayjs().toString(),
      message: String(err),
      options: { variant: 'error' },
    })
  })

  return <></>
})
