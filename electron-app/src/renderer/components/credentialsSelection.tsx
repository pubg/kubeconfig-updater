import { observer } from 'mobx-react-lite'
import { Box, MenuItem, Select, styled, Typography } from '@mui/material'

type Option = {
  key: string
  label: string
  inactive?: boolean
}

const CredentialsSelectionContainer = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    width: '100%',

    // flexbox
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})

export interface CredentialsSelectionProps {
  accountId: string
  accountAlias?: string
  onChange?: (value: string) => unknown
  value: string
  options: Option[]
}

export default observer(function CredentialsSelection({
  accountId,
  onChange,
  value,
  options,
}: CredentialsSelectionProps) {
  return (
    <CredentialsSelectionContainer>
      <Typography>{accountId}</Typography>
      <Select
        id="credentials-select"
        size="small"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        sx={{ width: '16em' }}
      >
        {options.map(({ key, label, inactive }) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </CredentialsSelectionContainer>
  )
})
