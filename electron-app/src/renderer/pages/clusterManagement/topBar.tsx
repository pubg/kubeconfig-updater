import { Refresh } from '@mui/icons-material'
import {
  Stack,
  FormGroup,
  TextField,
  Autocomplete,
  Button,
  UseAutocompleteProps,
  ButtonGroup,
  MenuItem,
  useTheme,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import { longestCommonSequence } from '../../utils/strings/lcs'
import browserLogger from '../../logger/browserLogger'
import { useResolve } from '../../hooks/container'
import ClusterManagementUIStore from './UIStore/ClusterManagementUIStore'
import ClusterMetadataStore from '../../store/clusterMetadataStore'
import { ClusterMetadataItem, ClusterMetadataItemFilter } from './UIStore/types'

// use string alias over const enum
// https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/
type ViewType = 'All' | 'Registered' | 'Suggested'

function filterFactory(name: string, viewType: ViewType): ClusterMetadataItemFilter {
  const filter = ({ data }: ClusterMetadataItem): boolean => {
    // fuzzy search
    const clusterName = data.metadata.clustername
    if (name.length > 0 && !(longestCommonSequence(clusterName, name) === name.length)) {
      return false
    }

    if (viewType === 'Registered') {
      return data.status === ClusterInformationStatus.REGISTERED_OK
    }
    if (viewType === 'Suggested') {
      return data.status !== ClusterInformationStatus.REGISTERED_OK
    }

    return true
  }

  return filter
}

export default observer(function TopBar() {
  const store = useResolve(ClusterManagementUIStore)
  const requester = useResolve(ClusterMetadataStore)

  // define variables
  const [nameFilter, setNameFilter] = useState('')
  const [viewType, setViewType] = useState<ViewType>('All')
  const reloadDropdownRef = useRef(null)

  // update store's filter when filter variables are changed
  useEffect(() => {
    store.setFilter(filterFactory(nameFilter, viewType))
  }, [store, nameFilter, viewType])

  // define handlers
  const onTagSelectChanged: UseAutocompleteProps<string, false, false, false>['onChange'] = (e, value) => {
    browserLogger.debug(`selected tag: ${value}`)
    store.setGroupTag(value)
  }

  const onHardReloadClick = _.debounce(
    useCallback(() => {
      requester.fetchMetadata(true)
    }, [requester]),
    500
  )

  const theme = useTheme()

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      marginLeft="32px"
      marginRight="32px"
      zIndex={theme.zIndex.appBar}
    >
      <FormGroup row sx={{ gap: '16px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <TextField
          size="small"
          label="Filter by Name"
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
            <TextField {...params} label="Group by Tag" />
          )}
        />
        <FormControl>
          <InputLabel id="viewType-select-label">Status Filter</InputLabel>
          <Select
            id="viewType-select"
            labelId="viewType-select-label"
            size="small"
            label="Status Filter"
            value={viewType}
            onChange={(e) => setViewType(e.target.value as ViewType)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Registered">Show Registered</MenuItem>
            <MenuItem value="Suggested">Show Suggested</MenuItem>
          </Select>
        </FormControl>
      </FormGroup>
      <Stack>
        <ButtonGroup variant="outlined" ref={reloadDropdownRef}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={onHardReloadClick}>
            Reload
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  )
})
