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
  accountId: string
  accountAlias?: string
  onChange: (value: string) => unknown
  value: string
  options: Option[]
}

export default function CredentialsSelection({ accountId, onChange, value, options }: CredentialsSelectionProps) {
  return (
    <CredentialsSelectionContainer>
      <Typography>{accountId}</Typography>
      <Select
        id="credentials-select"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ width: '16em' }}
      >
        {options.map(({ name, inactive }) => (
          <MenuItem value={name} key={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </CredentialsSelectionContainer>
  )
}
