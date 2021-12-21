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
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import * as ClusterMetadataRequester from '../../components/clusterMetadataRequester'
import { useStore, ClusterMetadataItem, ClusterMetadataItemFilter, ClusterMetadata } from './clusterMetadataStore'
import { longestCommonSequence } from '../../utils/strings/lcs'

function filterFactory(name: string, selectedTags: Set<string>, showRegistered: boolean): ClusterMetadataItemFilter {
  const filter = ({ data }: ClusterMetadataItem): boolean => {
    // fuzzy search
    const clusterName = data.metadata.clustername
    if (name.length > 0 && !(longestCommonSequence(clusterName, name) === name.length)) {
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
  const [selectedTags, setSelectedTags] = useState(new Set<string>())
  const [showRegistered, setShowRegistered] = useState(false)

  // update store's filter when filter variables are changed
  useEffect(() => {
    store.setFilter(filterFactory(nameFilter, selectedTags, showRegistered))
  }, [store, nameFilter, selectedTags, showRegistered])

  // define handlers
  const onGroupTagsChanged: CheckboxProps['onChange'] = (e, checked) => {
    const newSet = new Set(selectedTags)
    const tag = e.target.value

    if (checked) {
      newSet.add(tag)
    } else {
      newSet.delete(tag)
    }

    setSelectedTags(newSet)
  }

  const onShowRegisteredToggled: SwitchProps['onChange'] = (_, checked) => {
    setShowRegistered(checked)
  }

  // TODO: refactor this hard-coded requester binding to parent?
  const onReloadClick = useCallback(async () => {
    await requester.fetchMetadata()
    store.setItems(
      requester.items.map((item) => {
        const obj = item.toObject() as ClusterMetadata
        return { key: obj.metadata?.clustername, data: obj }
      })
    )
  }, [requester, store])

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
      <FormGroup row sx={{ gap: '16px', alignItems: 'center' }}>
        <TextField
          size="small"
          label="filter..."
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Autocomplete
          multiple
          options={store.tags}
          disableCloseOnSelect
          style={{ width: '256px' }}
          size="small"
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Group with Tag" />
          )}
          renderOption={(props, option, { selected }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>
              <Checkbox checked={selected} onChange={onGroupTagsChanged} />
              {option}
            </li>
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
