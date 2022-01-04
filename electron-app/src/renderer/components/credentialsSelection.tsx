import { Autocomplete, AutocompleteProps, Box, styled, TextField, Typography } from '@mui/material'
import { useCallback, useMemo } from 'react'

type Option = {
  credentialsName: string
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

type TypedAutocompleteProps<T = undefined> = AutocompleteProps<T, undefined, undefined, undefined>

export interface CredentialsSelectionProps {
  accountName: string
  onChange: TypedAutocompleteProps<Option['credentialsName']>['onChange']
  options: Option[]
}

export default function CredentialsSelection({ accountName, onChange, options }: CredentialsSelectionProps) {
  const renderInput: TypedAutocompleteProps['renderInput'] = useCallback((params) => {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <TextField {...params} label="Resolver Type" />
    )
  }, [])

  const optionStrings = useMemo(() => options.map((option) => option.credentialsName), [options])

  return (
    <CredentialsSelectionContainer>
      <Typography>{accountName}</Typography>
      <Autocomplete
        size="small"
        renderInput={renderInput}
        options={optionStrings}
        onChange={onChange}
        sx={{ width: '16em' }}
      />
    </CredentialsSelectionContainer>
  )
}
