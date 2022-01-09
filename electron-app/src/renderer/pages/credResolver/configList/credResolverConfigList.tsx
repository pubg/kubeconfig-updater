import { List, ListItem, styled, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'

const Container = styled(ListItem)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }
})

export interface CredResolverConfigListProps {
  vendor: string
  children: JSX.Element[]
}

// https://mobx.js.org/react-optimizations.html#render-lists-in-dedicated-components
const ListView = observer(({ children }: Pick<CredResolverConfigListProps, 'children'>) => {
  return <List sx={{ width: '100%', height: '100%' }}>{...children}</List>
})

export default observer(function CredResolverConfigList({ vendor, children }: CredResolverConfigListProps) {
  return (
    <Container divider>
      <Typography variant="h6" sx={{ mr: 'auto' }}>
        {vendor}
      </Typography>
      <ListView>{...children}</ListView>
    </Container>
  )
})
