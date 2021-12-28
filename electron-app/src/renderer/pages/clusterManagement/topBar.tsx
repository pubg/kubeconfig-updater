import { Refresh } from '@mui/icons-material'
import {
  Stack,
  FormGroup,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Button,
  CheckboxProps,
  SwitchProps,
  Switch,
  AutocompleteProps,
  UseAutocompleteProps,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import * as ClusterMetadataRequester from '../../components/clusterMetadataRequester'
import { useStore, ClusterMetadataItem, ClusterMetadataItemFilter } from './clusterMetadataStore'
import { longestCommonSequence } from '../../utils/strings/lcs'
import browserLogger from '../../logger/browserLogger'

function filterFactory(name: string, showRegistered: boolean): ClusterMetadataItemFilter {
  const filter = ({ data }: ClusterMetadataItem): boolean => {
    // fuzzy search
    const clusterName = data.metadata.clustername
    if (name.length > 0 && !(longestCommonSequence(clusterName, name) === neme.length)) {
      return false
    }

    // filter by tags
    // TODO

    // filter by registered state
    if (!showRegistered) {
      if (data.status === ClusterInformationStatus.REGISTERED_OK) {
        return false
      }
    }

    return true
  }

  return filter
}

export default observer(function TopBar() {
  const store = useStore()
  const requester = ClusterMetadataRequester.useContext()

  // define variables
  const [nameFilter, setNameFilter] = useState('')
  const [showRegistered, setShowRegistered] = useState(false)

  // update store's filter when filter variables are changed
  useEffect(() => {
    store.setFilter(filterFactory(nameFilter, showRegistered))
  }, [store, nameFilter, showRegistered])

  // define handlers
  const onTagSelectChanged: UseAutocompleteProps<string, false, false, false>['onChange'] = (e, value) => {
    browserLogger.debug(`selected tag: ${value}`)
    store.setGroupTag(value)
  }

  const onShowRegisteredToggled: SwitchProps['onChange'] = (_, checked) => {
    setShowRegistered(checked)
  }

  // TODO: refactor this hard-coded requester binding to parent?
  const onReloadClick = useCallback(async () => {
    await requester.fetchMetadata()
    store.setItems(requester.items.map((item) => ClusterMetadataItem.fromObject(item)))
  }, [requester, store])

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      marginLeft="32px"
      marginRight="32px"
    >
      <FormGroup row sx={{ gap: '16px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <TextField
          size="small"
          label="filter by name"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          autoFocus
        />
        <Autocomplete
          options={store.tags}
          disableCloseOnSelect
          style={{ minWidth: '256px', maxWidth: '1024px' }}
          size="small"
          onChange={onTagSelectChanged}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Group with Tag" />
          )}
        />
        <FormControlLabel control={<Switch onChange={onShowRegisteredToggled} />} label="Show Registered" />
      </FormGroup>
      <Stack>
        <Button variant="outlined" startIcon={<Refresh />} onClick={onReloadClick}>
          Reload
        </Button>
      </Stack>
    </Stack>
  )
})
