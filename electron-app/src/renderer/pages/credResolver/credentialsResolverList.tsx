import { Box, List, styled, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import CredentialSelectionListItem from './listItem/item'
import { ObservedCredResolverConfig } from '../../store/credResolverStore'

const Container = styled(Box)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
  }
})

export interface CredentialsResolverListProps {
  vendor: string
  items: ObservedCredResolverConfig[]
}

// https://mobx.js.org/react-optimizations.html#render-lists-in-dedicated-components
const ListView = observer(({ items }: { items: ObservedCredResolverConfig[] }) => {
  return (
    <List>
      {items.map((item) => (
        <CredentialSelectionListItem key={item.accountid} item={item} />
      ))}
    </List>
  )
})

export default observer(function CredentialsResolverList({ vendor, items }: CredentialsResolverListProps) {
  return (
    <Container>
      <Typography variant="h6">{vendor}</Typography>
      <ListView items={items} />
    </Container>
  )
})
