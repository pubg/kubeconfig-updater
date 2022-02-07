import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useResolve } from '../../hooks/container'
import { useListen } from '../../hooks/event'
import ClusterMetadataStore from '../../store/clusterMetadataStore'
import ClusterRegisterStore from '../../store/clusterRegisterStore'
import SnackbarStore from '../../store/snackbarStore'

export default observer(function ErrorNotification() {
  const snackbarStore = useResolve(SnackbarStore)
  const registerStore = useResolve(ClusterRegisterStore)
  const clusterStore = useResolve(ClusterMetadataStore)

  useListen(registerStore.errorEvent, (err) => {
    snackbarStore.push({
      key: dayjs().toString(),
      message: String(err),
      options: { variant: 'error' },
    })
  })

  useListen(clusterStore.errorEvent, (err) => {
    snackbarStore.push({
      key: dayjs.toString(),
      message: String(err),
      options: { variant: 'error' },
    })
  })

  return <></>
})
