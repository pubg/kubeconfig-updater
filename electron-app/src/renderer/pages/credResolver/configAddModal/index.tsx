/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Button,
  ClickAwayListener,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Paper,
  Popper,
  PopperProps,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import LINQ from 'linq'
import { useResolve } from '../../../hooks/container'
import CredResolverStore from '../../../store/credResolverStore'
import ProfileStore from '../../../store/profileStore'
import VendorStore from '../../../store/vendorStore'

interface ConfigAddData {
  vendor: string
  account: string
}

export interface ConfigAddModalProps {
  popperProps: PopperProps
  onSubmit: (data: ConfigAddData) => void
  onAbort: () => void
}

// TODO: use memo?
export default function ConfigAddModal({ popperProps, onSubmit, onAbort }: ConfigAddModalProps) {
  const profileStore = useResolve(ProfileStore)
  const credResolverStore = useResolve(CredResolverStore)
  const vendorStore = useResolve(VendorStore)

  const [vendor, setVendor] = useState('')
  const [account, setAccount] = useState('')

  const usedAccounts = LINQ.from(credResolverStore.credResolvers)
    .select((config) => config.value.accountid)
    .distinct()
    .toArray()

  const profiles = LINQ.from(profileStore.profiles)
    .where((profile) => profile.infravendor === vendor)
    .where((profile) => !usedAccounts.includes(profile.accountid))
    .select((profile) => profile.accountid)
    .distinct()
    .toArray()

  const validateVendor = () => {
    return vendor !== ''
  }

  const validateAccount = () => {
    return account !== ''
  }

  const canSubmit = () => {
    return [validateVendor, validateAccount].every((func) => func())
  }

  const onAddClicked = () => {
    const data: ConfigAddData = { account, vendor }

    onSubmit(data)
  }

  return (
    <Popper {...popperProps}>
      {({ TransitionProps }) => (
        // mouseEvent="onMouseUp" required to prevent confliction with Selection
        // https://github.com/mui-org/material-ui/issues/12034
        <ClickAwayListener onClickAway={onAbort} mouseEvent="onMouseUp">
          <Fade {...TransitionProps} timeout={300}>
            <Paper elevation={4} sx={{ width: '12em', mt: '8px', padding: '16px' }}>
              <FormControl sx={{ display: 'flex', flexDirection: 'column', mb: '8px' }}>
                {/* header */}
                <FormLabel>Add Account</FormLabel>

                {/* vendor selection */}
                <TextField
                  select
                  error={!validateVendor()}
                  id="vendor"
                  label="vendor"
                  variant="outlined"
                  value={vendor}
                  size="small"
                  onChange={(e) => setVendor(e.target.value)}
                  margin="normal"
                >
                  {vendorStore.vendors.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>

                {/* account input */}
                <Autocomplete
                  autoHighlight
                  freeSolo
                  renderInput={(params) => <TextField {...params} label="accountId" />}
                  size="small"
                  value={account}
                  options={profiles}
                  onChange={(_, value) => setAccount(value ?? '')}
                />
              </FormControl>

              {/* add button */}
              <Button
                size="small"
                variant="outlined"
                onClick={onAddClicked}
                disabled={!canSubmit()}
                sx={{ display: 'flex', ml: 'auto' }}
              >
                Add
              </Button>
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  )
}
