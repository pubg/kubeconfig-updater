import { Box, List, ListItem, styled, Typography } from '@mui/material'

const Container = styled(Box)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
  }
})

export interface CredentialsResolverListProps {
  vendor: string
  children: JSX.Element[]
}

export default function CredentialsResolverList({ vendor, children }: CredentialsResolverListProps) {
  return (
    <Container>
      <Typography variant="h6">{vendor}</Typography>
      <List>
        {children.map((item) => (
          <ListItem key={item.key}>{item}</ListItem>
        ))}
      </List>
    </Container>
  )
}
