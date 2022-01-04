import { Box, MenuItem, Select, SelectChangeEvent, SelectProps, styled, Typography } from '@mui/material'
import { useCallback, useState } from 'react'

type Option = {
  name: string
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
  accountName: string
  onChange: (value: string) => unknown
  defaultValue?: Option
  options: Option[]
}

export default function CredentialsSelection({
  accountName,
  onChange,
  defaultValue,
  options,
}: CredentialsSelectionProps) {
  const [value, setValue] = useState(defaultValue?.name ?? '')
  const changeHandler = useCallback(
    (e: SelectChangeEvent<string>) => {
      setValue(e.target.value)
      onChange(value)
    },
    [onChange, value]
  )

  return (
    <CredentialsSelectionContainer>
      <Typography>{accountName}</Typography>
      <Select id="credentials-select" size="small" value={value} onChange={changeHandler} sx={{ width: '16em' }}>
        {options.map(({ name, inactive }) => (
          <MenuItem value={name} key={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </CredentialsSelectionContainer>
  )
}
