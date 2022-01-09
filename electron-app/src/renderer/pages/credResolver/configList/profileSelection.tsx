import { observer } from 'mobx-react-lite'
import { MenuItem, Select, SelectProps } from '@mui/material'

type ProfileSelectioOption = {
  key: string
  label: string
  inactive?: boolean
}

export interface ProfileSelectionProps {
  onChange?: SelectProps<string>['onChange']
  value: string
  getOptions: () => ProfileSelectioOption[]
}

export default observer(function ProfileSelection({ onChange, value, getOptions }: ProfileSelectionProps) {
  const options = getOptions()

  return (
    <Select id="credentials-select" size="small" value={value} onChange={onChange} sx={{ width: '16em' }}>
      {options.map(({ key, label, inactive }) => (
        <MenuItem key={key} value={key}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
})
