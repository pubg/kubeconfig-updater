import { ListItem, MenuItem, Select, styled, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { ObservedCredResolverConfig } from '../store/credResolverStore'

const Container = styled(ListItem)(({ theme }) => {
  return {}
})

type Option = {
  key: string
  label: string
  inactive?: boolean
}

interface SelectionProps {
  value: string
  getOptions: () => Option[] // https://mobx.js.org/react-optimizations.html#dereference-values-late
  onSelected?: (value: string) => void
}

const Selection = observer(({ getOptions: optionsFunc, onSelected }: SelectionProps) => {
  const value = ''
  const options: Option[] = optionsFunc()

  return (
    <Select size="small" value={value} onChange={(e) => onSelected?.(e.target.value)}>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
})

export interface CredResolverListItemProps {
  item: ObservedCredResolverConfig
  getOptions: () => Option[]
}

export default observer(function CredResolverListItem({ item, getOptions }: CredResolverListItemProps) {
  const accountId = ''
  const value =

  return (
    <Container>
      <Typography>{accountId}</Typography>
      <Selection value={} getOptions={getOptions} />
    </Container>
  )
})
