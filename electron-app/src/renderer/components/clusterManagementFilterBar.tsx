import { Refresh } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  SwitchProps,
  TextField,
  TextFieldProps,
} from '@mui/material'

interface ClusterManagementFilterBarProps {
  onNameFilterChanged: TextFieldProps['onChange']
  onReloadClick: ButtonProps['onClick']
  onShowRegisterToggled: SwitchProps['onChange']
  groupTags: string[]
}

export default function ClusterManagementFilterBar({
  groupTags,
  onNameFilterChanged,
  onShowRegisterToggled,
  onReloadClick,
}: ClusterManagementFilterBarProps) {
  return (
    <Stack>
      <FormGroup>
        <TextField
          size="small"
          label="filter..."
          variant="outlined"
          onChange={onNameFilterChanged}
        />
        <Autocomplete
          multiple
          options={groupTags}
          disableCloseOnSelect
          getOptionLabel={(label) => label}
          style={{ width: '256px' }}
          size="small"
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Group with Tag" />
          )}
          renderOption={(props, option, { selected }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>
              <Checkbox checked={selected} />
              {option}
            </li>
          )}
        />
        <FormControlLabel
          control={<Switch onChange={onShowRegisterToggled} />}
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
