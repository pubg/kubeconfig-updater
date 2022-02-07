import { Refresh, ArrowDropDownOutlined } from '@mui/icons-material'
import {
  Stack,
  FormGroup,
  TextField,
  Autocomplete,
  FormControlLabel,
  Button,
  SwitchProps,
  Switch,
  UseAutocompleteProps,
  ButtonGroup,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Grow,
  useTheme,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ClusterInformationStatus } from '../../protos/kubeconfig_service_pb'
import { longestCommonSequence } from '../../utils/strings/lcs'
import browserLogger from '../../logger/browserLogger'
import { useResolve } from '../../hooks/container'
import ClusterManagementUIStore from './UIStore/ClusterManagementUIStore'
import ClusterMetadataStore from '../../store/clusterMetadataStore'
import { ClusterMetadataItem, ClusterMetadataItemFilter } from './UIStore/types'

// use string alias over const enum
// https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/
type ViewType = 'All' | 'Registered' | 'Unregistered'

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
    if (viewType === 'Unregistered') {
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
  const [showReloadDropdown, setShowReloadDropdown] = useState(false)
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

  // TODO: refactor this hard-coded requester binding to parent?
  const onReloadClick = useCallback(async () => {
    await requester.fetchMetadata()
  }, [requester])

  const onHardReloadClick = useCallback(async () => {
    setShowReloadDropdown(false)
    requester.fetchMetadata(true)
  }, [requester])

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
          <InputLabel id="viewType-select-label">view</InputLabel>
          <Select
            id="viewType-select"
            labelId="viewType-select-label"
            size="small"
            label="view"
            value={viewType}
            onChange={(e) => setViewType(e.target.value as ViewType)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Registered">Registered</MenuItem>
            <MenuItem value="Unregistered">Unregistered</MenuItem>
          </Select>
        </FormControl>
      </FormGroup>
      <Stack>
        <ButtonGroup variant="outlined" ref={reloadDropdownRef}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={onReloadClick}>
            Reload
          </Button>
          <Button variant="outlined" size="small" onClick={() => setShowReloadDropdown(!showReloadDropdown)}>
            <ArrowDropDownOutlined />
          </Button>
        </ButtonGroup>
        {/* TODO: make this Popper width same as parent */}
        {/* read: https://github.com/floating-ui/floating-ui/issues/794 */}
        <Popper open={showReloadDropdown} anchorEl={reloadDropdownRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Grow {...TransitionProps}>
              <Paper elevation={8}>
                <ClickAwayListener onClickAway={() => setShowReloadDropdown(false)}>
                  <MenuList>
                    <MenuItem key="force-reload" onClick={onHardReloadClick}>
                      Hard Reload
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    </Stack>
  )
})
