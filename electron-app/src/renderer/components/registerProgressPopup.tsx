import { Snackbar, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useContext } from './clusterRegisterRequester'

export default observer(function RegisterProgressPopup() {
  const requester = useContext()

  const action = <></>

  return (
    <Snackbar open={requester.state === 'processing'}>
      <Typography>
        processing {requester.processedCount} / {requester.length}
      </Typography>
    </Snackbar>
  )
})
