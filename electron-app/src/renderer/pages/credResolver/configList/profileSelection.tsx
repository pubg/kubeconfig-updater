import { observer } from 'mobx-react-lite'
import { MenuItem, Select, SelectProps } from '@mui/material'
import { Profile } from '../../../protos/kubeconfig_service_pb'

export type ProfileSelectionOption = {
  key: string
  label: string
  profile?: Profile.AsObject
  inactive?: boolean
}

export interface ProfileSelectionProps {
  onChange?: SelectProps<string>['onChange']
  value: string
  options: ProfileSelectionOption[]
}

export default observer(function ProfileSelection({ onChange, value, options }: ProfileSelectionProps) {
  return (
    <Select id="credentials-select" size="small" value={value} onChange={onChange} sx={{ width: '16em' }}>
      {options.map(({ key, label, inactive }) => (
        <MenuItem key={key} value={key} disabled={inactive}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
})
