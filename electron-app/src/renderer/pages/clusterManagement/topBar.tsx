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
import { useEffect, useState } from 'react'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import { Filter, MetadataItem, useStore } from './clusterMetadataStore'

function filterFactory(
  name: string,
  selectedTags: Set<string>,
  showRegistered: boolean
): Filter {
  const filter = ({ data }: MetadataItem): boolean => {
    if (!data.metadata.clustername.includes(name)) {
      return false
    }

    if (
      !showRegistered ||
      (showRegistered && data.status === ClusterInformationStatus.REGISTERED_OK)
    ) {
      return false
    }

    // TODO: add group filter function

    return true
  }

  return filter
}

export default function TopBar() {
  const store = useStore()

  // define variables
  const [nameFilter, setNameFilter] = useState('')
  const [selectedTags, setSelectedTags] = useState(new Set<string>())
  const [showRegistered, setShowRegistered] = useState(false)

  // update store's filter when filter variables are changed
  useEffect(() => {
    console.log(
      `filter updated, value: ${nameFilter}, ${selectedTags}, ${showRegistered}`
    )
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

  const onReloadClick = () => {}

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
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
        <FormControlLabel
          control={<Switch onChange={onShowRegisteredToggled} />}
          label="Show Registered"
        />
      </FormGroup>
      <Stack>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onReloadClick}
        >
          Reload
        </Button>
      </Stack>
    </Stack>
  )
}
