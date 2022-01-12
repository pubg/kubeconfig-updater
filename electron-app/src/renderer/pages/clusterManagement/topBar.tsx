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

function filterFactory(name: string, showRegistered: boolean): ClusterMetadataItemFilter {
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
  const store = useResolve(ClusterManagementUIStore)
  const requester = useResolve(ClusterMetadataStore)

  // define variables
  const [nameFilter, setNameFilter] = useState('')
  const [showRegistered, setShowRegistered] = useState(true)
  const [showReloadDropdown, setShowReloadDropdown] = useState(false)
  const reloadDropdownRef = useRef(null)

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
        <FormControlLabel
          control={<Switch checked={showRegistered} onChange={onShowRegisteredToggled} />}
          label="Show Registered"
        />
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
