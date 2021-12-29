import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useResolve } from '../hooks/container'
import { useAutorun } from '../hooks/mobx'
import SnackbarStore from '../store/snackbarStore'

export default observer(function NotiSnackbar() {
  const snackbar = useSnackbar()
  const store = useResolve(SnackbarStore)
  // NOTE: can this cause missing message?
  const [consumedMessageKeys, setConsumedMessageKeys] = useState<string[]>([])

  useAutorun(() => {
    for (const item of store.notifications) {
      snackbar.enqueueSnackbar(item.message, item.options)
    }

    setConsumedMessageKeys(store.notifications.map((item) => item.key))

    // don't call action inside reaction or it might cause recursive call.
  })

  useEffect(() => {
    // required this to prevent maximum update depth error
    if (consumedMessageKeys.length > 0) {
      store.removeAll(consumedMessageKeys)
      setConsumedMessageKeys([])
    }
  }, [consumedMessageKeys, store])

  return <></>
})
